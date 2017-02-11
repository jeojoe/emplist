import React, { Component } from 'react';
import { Link } from 'react-router';
import Loader from '../../App/components/Loader';
import s from './RequestListButton.css';

class RequestListButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
    };
  }
  componentWillUnmount() {
    console.log('will go');
  }
  render() {
    const { fetching } = this.state;
    return (
      <Link
        to="/request" className="button button-primary"
        onClick={() => {
          console.log('click');
          this.setState({ fetching: true }, ()=> console.log('yo'));
        }}
      >
        {fetching &&
          <div className={s.loaderWrapper}>
            <Loader size="25px" />
          </div>
        }Request your list
      </Link>
    );
  }
}

export default RequestListButton;
