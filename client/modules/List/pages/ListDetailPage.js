import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import callApi from '../../../util/apiCaller';

import AdminHeader from '../components/AdminHeader';
import s from './ListDetailPage.css';
import sTag from '../../Request/components/SkillTagsInput.css';

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
    if (pathname.indexOf('/admin/request/') < 0) {
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
      callApi(`/requests/${id}`, 'get').then((res, err) => {
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
    } = list;

    const Tags = (
      <ReactTags
        tags={skills.map((text, id) => {
          return { id, text };
        })}
        readOnly={true}
        classNames={{
          tag: sTag.skill,
        }}
      />
    );

    const Location = `${company_location.city}, ${company_location.city}`;
    const Salary = `${salary.min} - ${salary.max} B`;

    return (
      <div>
        <div className={s['image-wrapper']}>
          <img src={company_image} alt={`${company_name}'s logo`} className={s.image} />
        </div>
        <div>
          <p>Company: <strong>{company_name}</strong></p>
        </div>

        <div>
          <p>Location: {Location}</p>
        </div>

        <div>
          <p>Sklls: {Tags}</p>
        </div>

        <div>
          <p>Salary: {Salary}</p>
        </div>

        <div>
          <p>{details}</p>
        </div>

        <div>
          <strong>How to apply</strong>
          <p>{how_to_apply}</p>
        </div>
      </div>
    );
  }

  render() {
    const { list, err } = this.state;
    const { location: { pathname } } = this.props;

    const isAdmin = pathname.indexOf('/admin/request/') >= 0;
    return (
      <div className="container">
        {list && isAdmin ?
          <AdminHeader list={list} list_id={list.list_id} /> : ''
        }
        {list ? this.renderList(list) : <p>{err || 'Loading...'}</p>}
      </div>
    );
  }
}

ListDetailPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default ListDetailPage;
