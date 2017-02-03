import React from 'react';
import s from './HeaderText.css';
import { FormattedMessage } from 'react-intl';

const HeaderText = (props) => (
  <div>
    <p><FormattedMessage id="requestListHeader" /></p>
    <p className={s.hilight}>You can post in Thai and English but English is recommended for broader audience.</p>
  </div>
);

export default HeaderText;
