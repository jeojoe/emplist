import React, { Component } from 'react';
import { Link } from 'react-router';
import HeaderDescription from '../components/HeaderDescription';
import ListFeedsWrapper from '../components/ListFeedsWrapper';
import ListItem from '../components/ListItem';
import _ from 'lodash';

import s from './ListFeedsPage.css';

import callApi from '../../../util/apiCaller';
import cn from 'classnames';

const NUM_ITEMS_PER_FETCH = 6;

class ListFeedsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      lastIndex: -1,             // keep track of last index to fetch more
      numLastFetch: -1,          // keep tract of last fetch count, if 0 -> no more lists.
      feedBottomDescription: '', // cool loading text
      filter: 'bangkok',
      lists: [],
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.fetchLists = this.fetchLists.bind(this);
  }

  componentDidMount() {
    this.handleScroll = _.throttle(this.handleScroll, 1000);
    window.addEventListener('scroll', this.handleScroll);

    // initial fetch
    this.fetchLists(this.state.lastIndex + 1, NUM_ITEMS_PER_FETCH);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    // if reach bottom, load more
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 40) {
      this.fetchLists(this.state.lastIndex + 1, NUM_ITEMS_PER_FETCH);
    }
  }

  fetchLists(startIndex, num_to_fetch) {
    if (this.state.fetching || this.state.numLastFetch === 0) {
      return;
    }

    console.log(`fetch start ${startIndex}`);

    this.setState({
      fetching: true,
      feedBottomDescription: 'Oh you need more, wait...',
    });

    callApi(`/lists?startIndex=${startIndex}&num=${num_to_fetch}`, 'get').then((res, err) => {
      if (err) {
        alert('Failed loading lists !');
        return;
      }
      const previousLists = this.state.lists;
      const previousLength = previousLists.length;
      this.setState({
        lists: previousLists.concat(res.lists),
        lastIndex: previousLength + res.lists.length - 1,
        numLastFetch: res.lists.length,
        feedBottomDescription: (res.lists.length === 0) ? `No more dude. We have ${previousLists.length} jobs.` : this.state.feedBottomDescription,
      });
    });
    setTimeout(() => this.setState({ fetching: false }), 1000);
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
    const { feedBottomDescription, lists, filter } = this.state;
    const isBangkok = filter === 'bangkok';

    return (
      <div className="container">
        <HeaderDescription />
        <Link to="/request" className="button button-primary" >Request your list</Link>
        {/*
          Filter
        */}
        <div className={s.filter}>
          Thailand :
          <a
            href="#" className={cn(s['filter-link'], { [`${s.active}`]: isBangkok })}
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
        <div className={s['bottom-div']}>{feedBottomDescription}</div>
      </div>
    );
  }
}

export default ListFeedsPage;
