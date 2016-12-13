import React, { PropTypes } from 'react';
import ListItem from './ListItem';
import s from './ListFeedsWrapper.css';

const ListFeedsWrapper = (props) => (
  <div className={s['feeds-wrapper']}>
    {
      props.lists.map(list => (
        <ListItem list={list} key={list._id} />
      ))
    }
  </div>
);

ListFeedsWrapper.propTypes = {
  lists: PropTypes.array.isRequired,
};

export default ListFeedsWrapper;
