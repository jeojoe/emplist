import React from 'react';

class DynamicSegmentedControl extends React.Component {
  static propTypes = {
    segments: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
      })
    ).isRequired,
    activeButtonStyle: React.PropTypes.string.isRequired,
    normalButtonStyle: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      titles: this.props.segments.map(o => o.title),
      activeIndex: 0,
    };
  }

  // *If props of this component changed,
  // it will not re-render if we don't do this!
  componentWillReceiveProps(nextProps) {
    // if same props, not rerender
    if (this.props === nextProps) { return; }
    this.setState({ titles: nextProps.segments.map(o => o.title) });
  }

  onClickForIndex = (idx) => () => {
    // set active index & call onClick
    this.setState({
      activeIndex: idx,
    });
    this.props.segments[idx].onClick();
  }

  getActiveIndex() {
    return this.state.activeIndex;
  }

  render() {
    const activeButtonStyle = this.props.activeButtonStyle;
    const normalButtonStyle = this.props.normalButtonStyle;

    const { segments } = this.props;
    const { titles, activeIndex } = this.state;

    const Buttons = segments.map((o, i) => {
      return (
        <button
          key={i}
          className={i === activeIndex ? activeButtonStyle : normalButtonStyle}
          onClick={this.onClickForIndex(i)}
        >
          {titles[i]}
        </button>);
    });

    return (
      <div>{Buttons}</div>
    );
  }
}

DynamicSegmentedControl.defaultProps = {
  normalButtonStyle: '',
  activeButtonStyle: 'button',
};

export default DynamicSegmentedControl;
