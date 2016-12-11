import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Style

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';

// Import Actions

const App = ({ children, dispatch }) => (
  <div>
    {process.env.NODE_ENV === 'development' && <DevTools />}
    <div>
      {/* titleTemplate="%s - Blog App" */}
      <Helmet
        title="emplist : simple finding jobs"
        meta={[
          { charset: 'utf-8' },
          {
            'http-equiv': 'X-UA-Compatible',
            content: 'IE=edge',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
        ]}
      />
      <div>
        {children}
        yooo
      </div>
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

// Retrieve data from store as props
// function mapStateToProps(store) {
//   return {
//     intl: store.intl,
//   };
// }

// export default connect(mapStateToProps)(App);
export default App;
