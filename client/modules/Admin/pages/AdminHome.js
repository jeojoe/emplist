import React, { Component } from 'react';
import AdminListFilter from '../components/AdminListFilter';
import ListFeedsWrapper from '../../List/components/ListFeedsWrapper';
import callApi from '../../../util/apiCaller';

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

  componentWillMount() {
    callApi('/requests').then((res, err) => {
      if (err) {
        alert(err);
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

export default AdminHome;
