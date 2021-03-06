import React, { Component, PropTypes } from 'react';
// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import Style
// Import Actions

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  render() {
    return (
      <div>
        {this.state.isMounted &&
          !window.devToolsExtension &&
          process.env.NODE_ENV === 'development' &&
          <DevTools />}
        <div>
          {/* titleTemplate="%s - Blog App" */}
          <Helmet
            title="Emplist : Great Talents Find Great Employers Easier !"
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
          <Navbar />
          <div style={{ minHeight: '500px' }}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;
