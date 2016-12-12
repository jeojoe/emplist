import React from 'react';
import Logo from './Logo';
import s from './Navbar.css';

const Navbar = () => (
  <div id={s.navbar}>
    <div className="container">
      <Logo />
      <div className={s['after-logo']}>
        <h6>Simple finding tech jobs !</h6>
      </div>
    </div>
  </div>
);

export default Navbar;
