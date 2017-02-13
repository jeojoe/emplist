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

const LoaderWithText = ({ text, centerInDiv = false, centerInPage = false }) => (
  <div
    className={c(s['loader-inline-wrapper'], { [s['center-in-page']]: centerInPage })}
    style={{ textAlign: centerInDiv ? 'center' : 'initial' }}
  >
    <Loader size="28px" borderWidth="4px" />
    <div style={{ marginLeft: '8px' }}> {text}</div>
  </div>
);

LoaderWithText.propTypes = {
  text: React.PropTypes.string.isRequired,
  centerInDiv: React.PropTypes.bool,
  centerInPage: React.PropTypes.bool,
};

export default Loader;
export { LoaderWithText };
