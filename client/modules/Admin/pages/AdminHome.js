import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AdminListFilter from '../components/AdminListFilter';
import ListFeedsWrapper from '../../List/components/ListFeedsWrapper';
import callApi from '../../../util/apiCaller';
import { getToken } from '../authToken';

class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      lists: [],
      filter: 'requests',
    };
  }

  // changeFilter = (filter) => {
  //   this.setState({ filter });
  // }
  componentDidMount() {
    const token = getToken();
    if (!token) {
      alert('No token.');
      return;
    }
    callApi(`/requests?token=${token}`, 'get').then((res) => {
      if (!res.ok) {
        this.props.router.push('/admin');
        alert(res.msg);
        console.log(res.err);
        return;
      }
      this.setState({ fetching: false, lists: res.requests });
    });
  }

  render() {
    const { filter, fetching, lists } = this.state;
    return (
      <div className="container">
        <AdminListFilter changeFilter={this.changeFilter} filter={filter} />
        {fetching ? 'Fetching' :
          <ListFeedsWrapper lists={lists} admin />
        }
      </div>
    );
  }
}

export default withRouter(AdminHome);
