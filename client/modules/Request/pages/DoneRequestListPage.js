import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import LocalizedMessage from '../../App/components/LocalizedMessage';
import callApi from '../../../util/apiCaller';

class DoneRequestListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      list_request: null,
      is_error: false,
      company_name: '',
      title: '',
      requesting: false,
      done: false,
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    callApi(`/requests/check/${id}`).then((res) => {
      if (!res.ok) {
        this.setState({ fetching: false, is_error: true });
      } else {
        this.setState({
          fetching: false,
          company_name: res.company_name,
          title: res.title,
        });
      }
    });
  }

  sendPromoteRequest = () => {
    if (!this.state.done) {
      this.setState({ requesting: true });
      const { id } = this.props.params;
      callApi(`/requests/promote/${id}`).then((res) => {
        if (!res.ok) {
          this.setState({ requesting: false });
          alert(res.msg);
          return;
        }
        this.setState({ requesting: false, done: true });
      });
    }
  }

  render() {
    const { fetching, is_error, company_name, requesting, done } = this.state;

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
        <LocalizedMessage id="doneNewRequestMsgDescription" />
        {/*<button
          className={done || requesting ? 'button' : 'button-primary'}
          onClick={this.sendPromoteRequest}
        >
          {requesting && 'Sending request..'}
          {!requesting && !done && `${company_name} requests promote listing`}
          {!requesting && done && 'You have requested, Thank you !'}
        </button>*/}
      </div>
    );
  }
}

export default DoneRequestListPage;
