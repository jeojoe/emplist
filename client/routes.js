/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/List/pages/ListFeedsPage');
  require('./modules/List/pages/ListDetailPage');
  require('./modules/Request/pages/RequestListPage');
  require('./modules/Request/pages/DoneRequestListPage');
  require('./modules/Admin/pages/AdminLogin');
  require('./modules/Admin/pages/AdminHome');
  require('./modules/App/pages/Page404');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/List/pages/ListFeedsPage').default);
        });
      }}
    />
    <Route
      path="/list/:id"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/List/pages/ListDetailPage').default);
        });
      }}
    />
    <Route
      path="/request"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Request/pages/RequestListPage').default);
        });
      }}
    />
    <Route
      path="/request/done/:id"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Request/pages/DoneRequestListPage').default);
        });
      }}
    />
    <Route
      path="/admin"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Admin/pages/AdminLogin').default);
        });
      }}
    />
    <Route
      path="/admin/home"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Admin/pages/AdminHome').default);
        });
      }}
    />
    <Route
      path="/admin/request/:id"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/List/pages/ListDetailPage').default);
        });
      }}
    />
    <Route
      path="*"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/App/pages/Page404').default);
        });
      }}
    />
  </Route>
);
