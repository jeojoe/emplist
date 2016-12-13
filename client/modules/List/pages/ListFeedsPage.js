import React, { Component } from 'react';
import { Link } from 'react-router';
import HeaderDescription from '../components/HeaderDescription';
import ListFeedsWrapper from '../components/ListFeedsWrapper';
import s from './ListFeedsPage.css';
import callApi from '../../../util/apiCaller';
import cn from 'classnames';

class ListFeedsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      filter: 'bangkok',
      lists: [],
    };
  }

  componentWillMount() {
    callApi('/lists?filter=bangkok', 'get').then((res, err) => {
      if (err) {
        alert('Failed loading lists !');
        return;
      }
      this.setState({ fetching: false, lists: res.lists });
    });
  }

  changeFilter = filter => {
    this.setState({ fetching: true, filter });
    callApi(`/lists?filter=${filter}`, 'get').then((res, err) => {
      if (err) {
        alert('Failed loading lists !');
        return;
      }
      this.setState({ fetching: false, lists: res.lists });
    });
  }

  render() {
    const { fetching, lists, filter } = this.state;
    const isBangkok = filter === 'bangkok';
    return (
      <div className="container">
        <HeaderDescription />
        <Link to="/post" className="button button-primary" >Request your list</Link>
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
        {/*
          Main Feed
        */}
        {fetching ?
          <div>Fetching Lists..</div>
          :
          <ListFeedsWrapper lists={lists} />
        }
      </div>
    );
  }
}

export default ListFeedsPage;
