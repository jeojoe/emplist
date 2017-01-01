import React, { Component } from 'react';
import callApi from '../../../util/apiCaller';

class AdminHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_id_state: null,
      password: '',
    };
  }

  approve = () => {
    const { list } = this.props;
    const { password } = this.state;
    callApi(`/requests/approve/${list._id}`, 'put', { password })
    .then((res, err) => {
      console.log(res, err);
      if (err) {
        alert(err.msg);
      } else {
        this.setState({ list_id: res.data.list_id });
      }
    });
  }

  render() {
    const { list_id } = this.props;
    return (
      <div>
        {!list_id && !this.state.list_id &&
          <div>
            <input type="password" onChange={(e) => this.setState({ password: e.target.value })} />
            <button className="button-primary" onClick={this.approve}>Approve</button>
          </div>
        }
        <p>List id is {list_id || this.state.list_id}</p>
      </div>
    );
  }
}

export default AdminHeader;
