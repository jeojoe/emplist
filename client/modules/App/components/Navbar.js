import React from 'react';
import Logo from './Logo';

const Navbar = () => (
  <div id="navbar" >
    <div className="container">
      <div className="row">
        <div className="four columns">
          <Logo />
        </div>
        <div className="eight columns">Eleven</div>
      </div>
    </div>
  </div>
);

export default Navbar;
