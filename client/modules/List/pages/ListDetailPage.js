import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import moment from 'moment';

import callApi from '../../../util/apiCaller';

import AdminHeader from '../../Admin/components/AdminHeader';
import { LoaderWithText } from '../../App/components/Loader';

import s from './ListDetailPage.css';
import sSkill from '../components/ListItem.css';

import { getToken } from '../../Admin/authToken';
// import HeaderText from '../components/HeaderText';

class ListDetailPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: null,
      err: null,
    };
  }

  componentDidMount() {
    const id = this.props.params.id;
    const { pathname } = this.props.location;
    const isAdmin = pathname.indexOf('/admin/request/') >= 0;
    if (!isAdmin) {
      callApi(`/list/${id}`, 'get').then((res, err) => {
        if (err) {
          this.setState({ err });
        } else {
          const list = res.list;
          if (list) {
            this.setState({ list });
          } else {
            this.setState({ err: 'List not found.' });
          }
        }
      });
    } else {
      const token = getToken();
      if (!token) {
        alert('No token.');
        return;
      }
      callApi(`/requests/${id}?token=${token}`, 'get').then((res, err) => {
        if (err) {
          this.setState({ err });
        } else {
          const list = res.data;
          if (list) {
            this.setState({ list });
          } else {
            this.setState({ err: 'List not found.' });
          }
        }
      });
    }
  }

  renderList(list) {
    const {
      company_image,
      company_name,
      company_location,
      skills,
      salary,
      details,
      how_to_apply,
      updated_at,
    } = list;
    const Tags = skills.map((skill, i) => <span className={sSkill.skill} key={i}>{skill}</span>);

    const Location = `${company_location.city}, ${company_location.country}`;

    const formatCurrency = (num) => parseInt(num, 10).toLocaleString();
    const Salary = salary.max === 9999999 ? 'Unspecified' : `${formatCurrency(salary.min)} - ${formatCurrency(salary.max)} THB`;

    return (
      <div id={s.content}>
        <div className={s.companyWrapper}>
          <img src={company_image} alt={`${company_name}'s logo`} />
          <span>{company_name}</span>
        </div>
        <div className={s.companyDetailRow}>
          <strong>Location :</strong> {Location}
        </div>
        <div className={s.companyDetailRow}>
          <strong>Skills :</strong> {Tags}
        </div>
        <div className={s.companyDetailRow}>
          <strong>Salary :</strong> {Salary}
          {/*
            FOR AUNNNNN
            if company didn't insert salary detail i made default min, max salary to 0 and 9999999 respectively (for analytic purpose). So if you need to check whether company has specified salary or not you need to check max salary is equal to 9999999 or not.
          */}
        </div>

        <div id={s.detailWrapper}>
          <div dangerouslySetInnerHTML={{ __html: details }} />
        </div>

        <div className={s.howWrapper}>
          <h5>How to apply</h5>
          <p>{how_to_apply}</p>
        </div>
        <div>
          <p>Updated: {moment(updated_at).fromNow()}</p>
        </div>
      </div>
    );
  }

  render() {
    const { list, err } = this.state;
    if (!list) {
      return (
        <div className="container" style={{ height: '500px' }}>
          {err ? <div>{err}</div> : <LoaderWithText text="Loading" centerInPage />}
        </div>
      );
    }

    const { location: { pathname }, params: { id } } = this.props;
    const isAdmin = pathname.indexOf('/admin/request/') >= 0;
    return (
      <div className="container">
        <div>
          {isAdmin ?
            <AdminHeader list={list} /> : ''
          }
          <div id={s.titleWrapper}>
            <h4 className={s.title}>{list.title}</h4>
          </div>
          <div id={s.wrapper}>
            {this.renderList(list)}
            {
              !isAdmin &&
                <Link to={`/el/${id}/auth`}>
                  Manage
                </Link>
            }
            <div className={s.divider} />
            <sub style={{ color: '#999' }}>All jobs on this site disregard of gender, age, ethnic and disability.</sub>
          </div>
        </div>
      </div>
    );
  }
}

ListDetailPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default withRouter(ListDetailPage);
