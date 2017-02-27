import React from 'react';
import { Link } from 'react-router';
import s from './ListItem.css';
import c from 'classnames';
// import moment from 'moment';

const List = ({ list: { _id, title, company_image, company_name,  allow_remote, salary, has_intern, has_equity, skills, request_type }, admin }) => (
  <div className={s.item}>
    <div className={s['image-wrapper']}>
      <Link to={admin ? `/admin/request/${_id}` : `/el/${_id}`} params={{ id: _id }} className={s.link}>
        <img src={company_image} alt={`${company_name}'s logo`} className={s.image} />
      </Link>
    </div>
    <div className={s['text-wrapper']}>
      <Link to={admin ? `/admin/request/${_id}` : `/el/${_id}`} params={{ _id }} className={s.link}>
        {title}
      </Link>
      <div>
        {/* Company Name */}
        <div className={`${s.bold} ${s.detail}`}>{company_name}</div>
        {/* Company Location */}
        {allow_remote &&
          <div className={c(s.detail, s.remote)}>
            &#10004; Remote
          </div>
        }
        {/* Internship */}
        {has_intern &&
          <div className={c(s.detail, s.green)}>
            &#10004; Internship
          </div>
        }
        {has_equity &&
          <div className={c(s.detail, s.purple)}>
            &#10004; Equity
          </div>
        }
        {/* Salary */}
        {salary.max !== 9999999 &&
          <div className={s.detail}>
            {salary.min > 999 ? `${salary.min / 1000}K` : salary.min}
            -
            {salary.max > 999 ? `${salary.max / 1000}K` : salary.max} <span className={s.baht}>THB</span>
          </div>
        }

        <div className={s.detail}>
          {skills.map((skill, i) =>
          <span className={s.skill} key={i}>{skill}</span>)}
        </div>

      </div>
      <div className={s.skillWrapper}>

      </div>
      {/* admin && <div>{request_type}</div> */}
    </div>
  </div>
);

export default List;
