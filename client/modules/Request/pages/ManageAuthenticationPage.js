import React, { Component } from 'react';
import { withRouter } from 'react-router';
import callApi from '../../../util/apiCaller';
import { setToken } from '../../Admin/authToken';
import sListDetailPage from '../../List/pages/ListDetailPage.css';

class ManageAuthenticationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  checkPassword = () => {
    const { password } = this.state;
    callApi(`/lists/${this.props.routeParams.id}/permission`, 'post',
      { password })
      .then((res) => {
        if (!res.ok) {
          alert(res.msg);
          console.log(res.err);
          return;
        }
        setToken(res.token);
        this.props.router.push(`/el/${this.props.routeParams.id}/edit`);
      });
  }

  render() {
    const { password } = this.state;
    return (
      <div className={sListDetailPage.container}>
        <div className={sListDetailPage.detailWrapper}>
          <p>Insert password to manage this list</p>
          <div>
            <input
              type="password" placeholder="Your password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <button
              onClick={this.checkPassword}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ManageAuthenticationPage.propTypes = {
  router: React.PropTypes.func,
};

export default withRouter(ManageAuthenticationPage);
