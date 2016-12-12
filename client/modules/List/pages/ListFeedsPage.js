import React, { Component } from 'react';
import { Link } from 'react-router';
import HeaderDescription from '../components/HeaderDescription';
import s from './ListFeedsPage.css';

export default class ListFeedsPage extends Component {
  render() {
    return (
      <div className="container">
        <HeaderDescription />
        <Link to="/post" className="button button-primary" >Request your list</Link>
      </div>
    );
  }
}
