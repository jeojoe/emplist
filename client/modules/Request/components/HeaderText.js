import React from 'react';
import s from './HeaderText.css';

const HeaderText = (props) => (
  <div>
    <p>Company can post a jobs for free. The post will be check and stay on site for one month. For promote listing please contact hi.emplist@gmail.com</p>
    <p className={s.hilight}>You can post in thai of course ! (English if you want to reach foreigner)</p>
  </div>
);

export default HeaderText;
