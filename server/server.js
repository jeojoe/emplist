import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

/* SSR Import begins here */
// React And Redux Setup
import IntlWrapper from '../client/modules/Intl/IntlWrapper';
import { configureStore } from '../client/modules/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';

import ListsRoutes from './routes/Lists.routes';
import ListRequestsRoutes from './routes/ListRequests.routes';
import UsersRoutes from './routes/Users.routes';
import CompaniesRoutes from './routes/Companies.routes';

// import dummyData from './dummy/dummyData';
import serverConfig from './config';

// Set bluebird promises as mongoose promise
//
// bluebird seems to be faster than native...
// --> http://stackoverflow.com/a/41837255/6666165
mongoose.Promise = require('bluebird');

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL,
  { config: { autoIndex: serverConfig.autoIndex } },
  (error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      throw error;
    }
  }
);

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use('/api', ListsRoutes);
app.use('/api', UsersRoutes);

// *We use middleware for auth in 'listRequestsRoutes' router, after this line,
// all APIs are validated for a token.
// The order of middleware(router.use(...)) is important*.
app.use('/api', ListRequestsRoutes);
app.use('/api', CompaniesRoutes);


/* SSR Begins here */

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="google-site-verification" content="2vjAlFV_HN6QWysSom046BOF4zyvr2bl0zaL3QWWeCs" />
        <link rel="icon" type="image/png" href="https://s3-ap-southeast-1.amazonaws.com/testemplist/site/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="https://s3-ap-southeast-1.amazonaws.com/testemplist/site/favicon-16x16.png" sizes="16x16" />
        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  // ***Isomorphic cookie for admin-auth
  // https://github.com/thereactivestack/react-cookie
  cookie.setRawCookie(req.headers.cookie);

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const store = configureStore();

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );
        // const initialView = renderToString(
        //   <Provider store={store}>
        //     <RouterContext {...renderProps} />
        //   </Provider>
        // );
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    // feed some dummy data in DB.
    // dummyData();
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;
