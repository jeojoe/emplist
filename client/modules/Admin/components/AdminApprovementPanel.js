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
      lists: [],
      filterIndex: 0,
      cacheListCount: [null, null],
    };
  }

  componentDidMount() {
    this.fetchDataForFilterIndex(this.state.filterIndex);
  }

  onClickForFilterIndex = (filterIndex) => () => {
    this.setState({ filterIndex });
    this.fetchDataForFilterIndex(filterIndex);
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
      lists: [],
    });
    callApi(`/requests?token=${token}&request_type=${request_type}`, 'get').then((res) => {
      if (!res.ok) {
        this.props.router.push('/admin');
        alert(res.msg);
        return;
      }
      const cacheListCount = this.state.cacheListCount;
      cacheListCount[filterIndex] = res.requests.length;
      this.setState({ fetching: false, lists: res.requests, cacheListCount });
    });
  }

  render() {
    const { fetching, lists, cacheListCount } = this.state;
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

    return (
      <div>
        {SegmentedControl}
        {fetching ? 'Fetching...' :
          <ListFeedsWrapper lists={lists} admin />
        }
      </div>
    );
  }
}
