import React from 'react';
import s from './HeaderText.css';
import { FormattedMessage } from 'react-intl';

const HeaderText = (props) => (
  <div>
    <p><FormattedMessage id="requestListHeader" /></p>
    <p className={s.hilight}>You can post in thai of course ! (English if you want to reach foreigner)</p>
  </div>
);

export default HeaderText;
