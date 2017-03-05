import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import callApi from '../../../util/apiCaller';

class DoneEditListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      list_request: null,
      is_error: false,
      title: '',
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    callApi(`/requests/check/${id}`).then((res) => {
      // console.log(res);
      if (!res.ok) {
        this.setState({ fetching: false, is_error: true });
        // console.log(res.err);
      } else {
        this.setState({
          fetching: false,
          company_name: res.company_name,
          title: res.title,
        });
      }
    });
  }

  render() {
    const { fetching, is_error } = this.state;

    if (fetching) {
      return (
        <div className="container">
          <p><FormattedMessage id="drlp_completing" /></p>
        </div>
      );
    }

    if (is_error) {
      return (
        <div className="container">
          <p><FormattedMessage id="drlp_err" /></p>
        </div>
      );
    }

    return (
      <div className="container">
        <h5>
          <FormattedMessage id="doneNewRequestMsgTitle" />
        </h5>
        <Link to="/"><FormattedMessage id="drlp_back" /></Link>
      </div>
    );
  }
}

export default DoneEditListPage;
