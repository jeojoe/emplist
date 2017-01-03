import React, { Component } from 'react';
import { withRouter } from 'react-router';
import callApi from '../../../util/apiCaller';
import { setToken } from '../authToken.js';

class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  login = () => {
    const { username, password } = this.state;
    callApi('/users/login', 'post', {
      username, password,
    }).then((res, err) => {
      if (err) return;
      if (!res.ok) {
        alert(res.msg);
        return;
      }
      if (!res.token) {
        alert('Oops, there is no token.');
        return;
      }

      // set token for client
      setToken(res.token);

      this.props.router.push('/admin/home');
    });
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="container">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <button
          className="button"
          onClick={this.login}
        >
          Log in
        </button>
      </div>
    );
  }
}

export default withRouter(AdminLogin);
