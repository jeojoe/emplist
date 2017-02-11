import React, { Component } from 'react';
import { withRouter } from 'react-router';
import DynamicSegmentedControl from '../components/DynamicSegmentedControl';
import AdminApprovementPanel from '../components/AdminApprovementPanel';
import CompanyList from '../components/CompanyList';
import SimpleDataFetchedView from '../components/SimpleDataFetchedView';
import { getToken } from '../authToken';

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
        // simple way to show read-only data-from-api view
        return (
          <SimpleDataFetchedView
            api={`/companies?token=${getToken()}`}
            successViewBuilder={(res) => {
              return (
                <div>
                  <h5>We got {res.companies.length} companies.</h5>
                  <CompanyList companies={res.companies} />
                </div>
              );
            }}
          />
        );
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
