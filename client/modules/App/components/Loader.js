import React from 'react';
import s from './Loader.css';
import c from 'classnames';

const Loader = ({ black, size = '40px', borderWidth = '5px' }) => (
  <div
    className={c(s.loader, { [`${s.black}`]: black })}
    style={{
      width: size, height: size,
      borderWidth, borderTopWidth: borderWidth,
    }}
  ></div>
);

Loader.propTypes = {
  black: React.PropTypes.bool,
  size: React.PropTypes.string,
  borderWidth: React.PropTypes.string,
};

export default Loader;
