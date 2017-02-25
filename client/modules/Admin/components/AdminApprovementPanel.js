import React from 'react';
import ListFeedsWrapper from '../../List/components/ListFeedsWrapper';
import DynamicSegmentedControl from './DynamicSegmentedControl';
import callApi from '../../../util/apiCaller';
import { getToken } from '../authToken';
import s from './AdminApprovementPanel.css';

export default class AdminApprovementPanel extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      allLists: {}, // keep all lists for all filters
      filterIndex: 0,
      cacheListCount: [null, null],
    };
  }

  // load data once
  componentDidMount() {
    this.fetchDataForFilterIndex(0);
    this.fetchDataForFilterIndex(1);
  }

  onClickForFilterIndex = (filterIndex) => () => {
    this.setState({ filterIndex });
  }

  requestTypeForIndex(index) {
    if (index === 0) {
      return 'new';
    } else if (index === 1) {
      return 'edit';
    }
    return 'invalid type';
  }

  filterTitleForIndex(index, length = null) {
    if (index === 0) {
      return length == null ? 'New' : `New (${length})`;
    } else if (index === 1) {
      return length == null ? 'Edit' : `Edit (${length})`;
    }
    return 'Invalid filter';
  }

  fetchDataForFilterIndex = (filterIndex) => {
    const request_type = this.requestTypeForIndex(filterIndex);
    const token = getToken();
    if (!token) {
      alert('No token.');
      return;
    }
    this.setState({
      fetching: true,
    });
    callApi(`/requests?token=${token}&request_type=${request_type}`, 'get').then((res) => {
      if (!res.ok) {
        this.props.router.push('/admin');
        alert(res.msg);
        return;
      }
      const cacheListCount = this.state.cacheListCount;
      cacheListCount[filterIndex] = res.requests.length;
      const newAllLists = this.state.allLists;
      newAllLists[filterIndex] = res.requests;
      this.setState({ fetching: false, allLists: newAllLists, cacheListCount });
    });
  }

  render() {
    const { fetching, allLists, cacheListCount, filterIndex } = this.state;
    const filteringSegments = [
      { title: this.filterTitleForIndex(0, cacheListCount[0]), onClick: this.onClickForFilterIndex(0) },
      { title: this.filterTitleForIndex(1, cacheListCount[1]), onClick: this.onClickForFilterIndex(1) },
    ];

    const SegmentedControl = (
      <DynamicSegmentedControl
        segments={filteringSegments}
        activeButtonStyle={s.activeFilterButton}
        normalButtonStyle={s.normalFilterButton}
      />
    );

    const list = allLists[filterIndex] || [];
    return (
      <div>
        {SegmentedControl}
        {fetching ? 'Fetching...' :
          list.length === 0 ? 'There is no lists.' : <ListFeedsWrapper lists={list} admin />
        }
      </div>
    );
  }
}
