import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import s from './ListItem.css';
import moment from 'moment';

const List = ({ list: { _id, title, company_image, company_name, company_location, allow_remote, exp, salary, created_at, skills, request_type }, admin }) => (
  <div className={s.item}>
    <div className={s['image-wrapper']}>
      <Link to={admin ? `/admin/request/${_id}` : `/list/${_id}`} params={{ id: _id }} className={s.link}>
        <img src={company_image} alt={`${company_name}'s logo`} className={s.image} />
      </Link>
    </div>
    <div className={s['text-wrapper']}>
      <Link to={admin ? `/admin/request/${_id}` : `/list/${_id}`} params={{ _id }} className={s.link}>
        {title}
      </Link>
      <div>
        {/* Company Name */}
        <div className={`${s.bold} ${s.detail}`}>{company_name}</div>
        {/* Company Location */}
        {/*<div className={s.detail}>{company_location.city} {allow_remote ? '(allow remote)' : ''}</div>*/}
        {/* Experience */}
        {exp.condition !== 'no' &&
          <div className={s.detail}>
            exp.
            {exp.condition === 'more_than' &&
              ` > ${exp.min} ${exp.min <= 1 ? 'year' : 'years'}`
            }
            {exp.condition === 'between' &&
              ` ${exp.min}-${exp.max} ${exp.max <= 1 ? 'year' : 'years'}`
            }
          </div>
        }
        {/* Internship */}
        {exp.has_intern &&
          <div className={`${s.detail} ${s.green}`}>
            Internship
          </div>
        }
        {/* Salary */}
        {salary.max !== 9999999 &&
          <div className={s.detail}>
            {salary.min}-{salary.max} <span className={s.baht}>฿</span>
          </div>
        }
        {/* Date */}
        <div className={s.detail}>
          {moment(created_at).fromNow()}
        </div>
      </div>
      <div>
        {skills.map((skill, i) =>
          <span className={s.skill} key={i}>{skill}</span>)}
      </div>
      {admin &&
        <div>{request_type}</div>
      }
    </div>
  </div>
);

// List.propTypes = {
//   list: PropTypes.shape({
//     company_id
//   }),
//   company: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   company: PropTypes.string.isRequired,
// };

export default List;
