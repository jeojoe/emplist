import React, { Component } from 'react';
import { withRouter } from 'react-router';
import callApi from '../../../util/apiCaller';
import { setToken } from '../../Admin/authToken';

class PasswordBeforeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      password: '',
    };
  }

  checkPassword = () => {
    const { password } = this.state;
    callApi(`/lists/${this.props.list_id}/permission`, 'post',
      { password })
      .then((res) => {
        if (!res.ok) {
          alert(res.msg);
          console.log(res.err);
          return;
        }
        setToken(res.token);
        this.props.router.push(`/list/${this.props.list_id}/edit`);
      });
  }

  render() {
    const { isShow, password } = this.state;
    return (
      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.setState({ isShow: true });
          }}
        >
          Edit
        </a>
        {isShow &&
          <div>
            <input
              type="text" placeholder="insert password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <button
              onClick={this.checkPassword}
            >
              Go
            </button>
          </div>
        }
      </div>
    );
  }
}

PasswordBeforeEdit.propTypes = {
  list_id: React.PropTypes.string,
  router: React.PropTypes.func,
};

export default withRouter(PasswordBeforeEdit);
