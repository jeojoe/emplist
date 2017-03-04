import React from 'react';
import s from './HeaderText.css';
import { FormattedMessage } from 'react-intl';

const HeaderText = () => (
  <div>
    <p><FormattedMessage id="requestListHeader" /></p>
    <p className={s.hilight}>English is recommended for broader audience.</p>
  </div>
);

export default HeaderText;
