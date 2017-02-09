import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DynamicSegmentedControl from '../components/DynamicSegmentedControl';
import AdminApprovementPanel from '../components/AdminApprovementPanel';

class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  onClickForIndex = (idx) => () => {
    this.setState({ activeIndex: idx });
  }

  activeViewForIndex(index) {
    switch (index) {
      case 0:
        return <AdminApprovementPanel />;
      case 1:
        return <div>In progress</div>;
      default:
        return <div>View not found for index {index}</div>;
    }
  }

  render() {
    const { activeIndex } = this.state;
    const segments = [
      { title: 'Approve', onClick: this.onClickForIndex(0) },
      { title: 'All Companies', onClick: this.onClickForIndex(1) },
    ];
    return (
      <div className="container">

        {/* segmented control */}
        <DynamicSegmentedControl segments={segments} />

        {/* active view */}
        {this.activeViewForIndex(activeIndex)}
      </div>
    );
  }
}

export default withRouter(AdminHome);
