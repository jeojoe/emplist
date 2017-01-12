import React, { Component } from 'react';
import s from './ChangePasswordSection.css';

class ChangePasswordSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }
  render() {
    const { isShow, oldPassword, newPassword, confirmPassword } = this.state;
    const { list_id } = this.props;
    return (
      <div>
        {isShow ?
          <div className="row">
            <input
              type="text" placeholder="Old Password"
              className={s.input}
              value={oldPassword}
              onChange={(e) => this.setState({ oldPassword: e.target.value })}
            />
            <input
              type="text" placeholder="New Password"
              value={newPassword}
              onChange={(e) => this.setState({ newPassword: e.target.value })}
            />
            <input
              type="text" placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => this.setState({ confirmPassword: e.target.value })}
            />
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

export default ChangePasswordSection;
