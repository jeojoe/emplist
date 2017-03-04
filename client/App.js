/**
 * Root Component
 */
import React from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import IntlWrapper from './modules/Intl/IntlWrapper';

// Import Routes
import routes from './routes';

// Base stylesheet
import './App.css';

browserHistory.listen(location => {
  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview');
});

export default function App(props) {
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </IntlWrapper>
    </Provider>
  );
}

App.propTypes = {
  store: React.PropTypes.object.isRequired,
};
