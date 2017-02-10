import React from 'react';
import callApi from '../../../util/apiCaller';

export default class SimpleDataFetchedView extends React.Component {
  static propTypes = {
    api: React.PropTypes.string.isRequired,
    method: React.PropTypes.oneOf(['get', 'post']),
    loadingViewBuilder: React.PropTypes.func,
    successViewBuilder: React.PropTypes.func.isRequired,
    errorViewBuilder: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      shownView: null,
    };
  }

  componentDidMount() {
    const { api, method, successViewBuilder, errorViewBuilder } = this.props;

    callApi(api, method || 'get').then((res) => {
      if (!res.ok) {
        this.setState({
          shownView: (errorViewBuilder && errorViewBuilder(res.msg)) || <div>Error loading data: {res.msg || JSON.stringify(res)}</div>,
        });
        return;
      }
      this.setState({
        shownView: successViewBuilder(res),
      });
    });
  }

  render() {
    const loader = this.props.loadingViewBuilder || <div>Loading...</div>;
    const { shownView } = this.state;
    return (
      <div>{shownView || loader}</div>
    );
  }
}
