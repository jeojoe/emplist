import React, { Component } from 'react';
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
    callApi(`/requests/check/${id}`).then((res, err) => {
      if (err || !res.exist) {
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
      callApi(`/requests/promote/${id}`).then((res, err) => {
        if (err) {
          this.setState({ requesting: false });
          alert(err);
          return;
        }
        this.setState({ requesting: false, done: true });
      });
    }
  }

  render() {
    const { fetching, is_error, company_name, requesting, done } = this.state;
    if (fetching) return <div>Completing process</div>;
    if (is_error) return <div>Have a problem !</div>;
    return (
      <div className="container">
        <p>
          Sending request done ! we will let you know via your email if your list passes checking.
        </p>
        <p>
          Posting list is complete free. but it has a problem of ถูกดันลงไป. So we'd like to know the needs of this feature. If you'd like to have this feature on your list please click the button below..
        </p>
        <button
          className={done ? 'button' : 'button-primary'}
          onClick={this.sendPromoteRequest}
        >
          {requesting && 'Sending request..'}
          {!requesting && !done && `${company_name}'d like to request promote listing`}
          {!requesting && done && 'You have requested, Thank you !'}
        </button>
      </div>
    );
  }
}

export default DoneRequestListPage;
