import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import callApi from '../../../util/apiCaller';

import s from './ListDetailPage.css';
import sTag from '../../Request/components/SkillTagsInput.css';

// import HeaderText from '../components/HeaderText';

class ListDetailPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: null,
    };
  }

  componentDidMount() {
    const id = this.props.params.id;
    callApi(`/list/${id}`, 'get').then((res, err) => {
      if (err) {
        console.log('Get detail error: ', err);
      } else {
        console.log('Get list success: ', JSON.stringify(res));
        const list = res.list;
        if (list) {
          this.setState({ list });
        }
      }
    });
  }

  renderList(list) {
    console.log(`render list please ${JSON.stringify(list, null, 2)}`);
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
    const list = this.state.list;

    return (
      <div className="container">
        {list ? this.renderList(list) : <p>Loading...</p>}
      </div>
    );
  }
}

ListDetailPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default ListDetailPage;
