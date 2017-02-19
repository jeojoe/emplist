import React, { Component } from 'react';
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
          <p>Completing request..</p>
        </div>
      );
    }

    if (is_error) {
      return (
        <div className="container">
          <p>Oops we have a problem ! please send you company name to <a>hi.emplist@gmail.com</a> so that we can figure it out !</p>
        </div>
      );
    }

    return (
      <div className="container">
        <p>
          Sending request done ! we will let you know via your email if your list passes checking.
        </p>
        <p>
          Posting list is complete free. but it has a problem of ถูกดันลงไป. So we'd like to know the needs of this feature. If you'd like to have this feature on your list please click the button below..
        </p>
      </div>
    );
  }
}

export default DoneEditListPage;
