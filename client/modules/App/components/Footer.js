import React from 'react';
import s from './Footer.css';

const Footer = () => (
  <div className="container">
    <div className={s.footer}>
      © 2017 Emplist
      <a
        href="https://goo.gl/forms/RioLVvO7jkQVIHHj2" target="_blank"
        className={s.contact}
      >
        Contact Us
      </a>
    </div>
  </div>
);

export default Footer;
