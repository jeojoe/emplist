import React, { Component } from 'react';
import { getToken } from '../authToken.js';
import callApi from '../../../util/apiCaller';

class AdminHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_id_after_approve: null,
      password: '',
    };
  }

  approve = () => {
    const token = getToken();
    const { list } = this.props;
    const { password } = this.state;
    if (list.request_type === 'new') {
      callApi(`/requests/approve/new/${list._id}?token=${token}`, 'put', { password })
      .then((res) => {
        if (!res.ok) {
          alert(res.msg);
          // console.log(res.err);
        } else {
          this.setState({ list_id_after_approve: res.data.list_id });
          alert('Done yo !');
        }
      });
    } else if (list.request_type === 'edit') {
      callApi(`/requests/approve/edit/${list._id}?token=${token}`, 'put', { password })
      .then((res) => {
        if (!res.ok) {
          alert(res.msg);
          // console.log(res.err);
        } else {
          this.setState({ list_id_after_approve: res.data.list_id });
          alert('Done yo !');
        }
      });
    } else {
      alert('Error : unknown request type !!');
    }
  }

  render() {
    const { list } = this.props;
    const { list_id_after_approve } = this.state;
    return (
      <div>
        {// Show approve button if not approved
          !list.is_approved && !list_id_after_approve &&
            <div>
              <input
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="You shall not pass !!!"
              />
              <button className="button-primary" onClick={this.approve}>Approve</button>
            </div>
        }
        {// Show list id if approved
          (list.is_approved || list_id_after_approve) &&
            <p>List id is {list.list_id || list_id_after_approve}</p>
        }
      </div>
    );
  }
}

export default AdminHeader;
