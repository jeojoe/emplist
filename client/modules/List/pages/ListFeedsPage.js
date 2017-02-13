import React, { Component } from 'react';
import RequestListButton from '../components/RequestListButton';
import HeaderDescription from '../components/HeaderDescription';
import ListFeedsWrapper from '../components/ListFeedsWrapper';
import { LoaderWithText } from '../../App/components/Loader';

import callApi from '../../../util/apiCaller';

import _ from 'lodash';
import c from 'classnames';
import s from './ListFeedsPage.css';


const NUM_ITEMS_PER_FETCH = 10;

class ListFeedsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      lastIndex: -1,             // keep track of last index to fetch more
      numLastFetch: -1,          // keep tract of last fetch count
      isAtTheEndOfFeed: false,         // numLastFetch < NUM_ITEMS_PER_FETCH
      filter: 'bangkok',
      lists: [],
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.fetchLists = this.fetchLists.bind(this);
  }

  componentDidMount() {
    this.fetchLists = _.throttle(this.fetchLists, 1000);
    window.addEventListener('scroll', this.handleScroll);

    // initial fetch
    this.fetchLists(this.state.lastIndex + 1, NUM_ITEMS_PER_FETCH);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    // if reach bottom, load more
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      this.fetchLists(this.state.lastIndex + 1, NUM_ITEMS_PER_FETCH);
    }
  }

  fetchLists(startIndex, num_to_fetch) {
    if (this.state.fetching || this.state.numLastFetch === 0 || (this.state.numLastFetch !== -1 && this.state.numLastFetch < NUM_ITEMS_PER_FETCH)) {
      return;
    }

    this.setState({
      fetching: true,
    });

    callApi(`/lists?startIndex=${startIndex}&num=${num_to_fetch}`, 'get').then((res, err) => {
      if (err) {
        alert('Failed loading lists !');
        return;
      }
      const previousLists = this.state.lists;
      const previousLength = previousLists.length;
      this.setState({
        fetching: false,
        lists: previousLists.concat(res.lists),
        lastIndex: previousLength + res.lists.length - 1,
        numLastFetch: res.lists.length,
        isAtTheEndOfFeed: res.lists.length < NUM_ITEMS_PER_FETCH,
      });
    });
  }

  changeFilter(filter) {
    this.setState({ fetching: true, filter });
    callApi(`/allLists?filter=${filter}`, 'get').then((res, err) => {
      if (err) {
        alert('Failed loading lists !');
        return;
      }
      this.setState({ fetching: false, lists: res.lists });
    });
  }

  render() {
    const { isAtTheEndOfFeed, lists, filter } = this.state;
    const isBangkok = filter === 'bangkok';

    const LoaderComponent = <LoaderWithText text="Loading your opportunities" center className={s['bottom-div']} />;

    return (
      <div className="container">
        <HeaderDescription />
        <RequestListButton />
        {/*
          Filter
        */}
        <div className={s.filter}>
          Thailand :
          <a
            href="#" className={c(s['filter-link'], { [`${s.active}`]: isBangkok })}
            // onClick={() => this.changeFilter('bangkok')}
          >
            Bangkok
          </a>
          {/*<a
            href="#" className={cn(s['filter-link'], { [`${s.active}`]: !isBangkok })}
            onClick={() => this.changeFilter('outside')}
          >
            Outside Bangkok
          </a>*/}
        </div>

        {/* main feed*/}
        <ListFeedsWrapper lists={lists} />
        {!isAtTheEndOfFeed ? LoaderComponent : <div className={s['bottom-div']}>We have {lists.length} jobs.</div>}
      </div>
    );
  }
}

export default ListFeedsPage;
