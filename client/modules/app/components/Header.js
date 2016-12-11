import React, { PropTypes } from 'react';
import { Link } from 'react-router';

// Import Style

const Header = (props, context) => (
  <div className="yo" >
    {
      context.router.isActive('/', true)
        ? <a href="#" onClick={props.toggleAddPost}>Add Post</a>
        : null
    }
  </div>
);

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  toggleAddPost: PropTypes.func.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default Header;
