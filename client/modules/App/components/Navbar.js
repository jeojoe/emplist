import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import c from 'classnames';
import Logo from './Logo';
import s from './Navbar.css';

import { switchLanguage } from '../../Intl/IntlActions';

const Navbar = ({ dispatch, intl }) => (
  <div id={s.navbar}>
    <div className="container">
      <Link to="/">
        <Logo />
      </Link>
      <div className={s['after-logo']}>
        <h6>Great Talents Find Great Employers Easier !</h6>
      </div>
      <div className={s.langButton}>
        <button
          onClick={() => dispatch(switchLanguage('th'))}
          className={c({ [`${s.active}`]: intl.locale === 'th' })}
        >TH</button>
        <button
          onClick={() => dispatch(switchLanguage('en'))}
          className={c({ [`${s.active}`]: intl.locale === 'en' })}
        >EN</button>
      </div>
    </div>
  </div>
);

Navbar.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(Navbar);
