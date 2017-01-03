import React, { Component } from 'react';
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
    const { list } = this.props;
    const { password } = this.state;
    callApi(`/requests/approve/new/${list._id}`, 'put', { password })
    .then((res, err) => {
      console.log(res, err);
      if (err) {
        alert(err.msg);
      } else {
        this.setState({ list_id_after_approve: res.data.list_id });
      }
    });
  }

  render() {
    const { list_id_already_approve } = this.props;
    const { list_id_after_approve } = this.state;
    return (
      <div>
        {// Show approve button if not approved
          !list_id_already_approve && !list_id_after_approve &&
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
          (list_id_already_approve || list_id_after_approve) &&
            <p>List id is {list_id_already_approve || list_id_after_approve}</p>
        }
      </div>
    );
  }
}

export default AdminHeader;
