import React, { PropTypes } from 'react';
import ListItem from './ListItem';
import s from './ListFeedsWrapper.css';

const ListFeedsWrapper = ({ lists, admin }) => (
  <div className={s['feeds-wrapper']}>
    <p>Yoo</p>
    {
      lists.map(list => (
        <ListItem list={list} key={list._id} admin={admin} />
      ))
    }
  </div>
);

ListFeedsWrapper.propTypes = {
  lists: PropTypes.array.isRequired,
  admin: PropTypes.boolean,
};

export default ListFeedsWrapper;
