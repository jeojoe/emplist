import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getToken } from '../../../util/token-helpers';
import callApi from '../../../util/apiCaller';

import s from './ChangePasswordSection.css';

class ChangePasswordSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      changing: false,
    };
  }

  changePassword = () => {
    if (this.state.changing) return;

    const { oldPassword, newPassword, confirmPassword } = this.state;
    const { list_id } = this.props;
    if (newPassword !== confirmPassword) {
      alert('New password does not match the confirm password.');
      return;
    }
    this.setState({ changing: true });
    callApi(`/lists/${this.props.list_id}/password?token=${getToken()}`, 'post',
      { oldPassword, newPassword, list_id })
    .then(res => {
      if (!res.ok) {
        alert(res.msg);
        console.log(res.err);
        this.setState({ changing: false });
        return;
      }
      alert('Successfully changed password!');
      this.props.router.push(`/list/${this.props.list_id}`);
    });
  }

  render() {
    const { isShow, oldPassword, newPassword, confirmPassword, changing } = this.state;
    return (
      <div>
        {isShow ?
          <div className="row">
            <div>
              <input
                type="password" placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => this.setState({ oldPassword: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password" placeholder="New Password"
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password" placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => this.setState({ confirmPassword: e.target.value })}
              />
            </div>
            <button
              className="button-primary"
              onClick={this.changePassword}
            >
              {changing ? 'Changing..' : 'Change password'}
            </button>
            {!changing && <button onClick={() => this.setState({ isShow: false })}>Cancel</button>}
          </div>
          :
          <button
            className="button"
            onClick={() => this.setState({ isShow: true })}
          >
            Change password
          </button>
        }
      </div>
    );
  }
}

ChangePasswordSection.propTypes = {
  list_id: React.PropTypes.string,
  router: React.PropTypes.func,
};

export default withRouter(ChangePasswordSection);
