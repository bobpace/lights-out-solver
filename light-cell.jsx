var React = require('react');
var R = require('ramda');

var LightCell = React.createClass({
  displayName: "LightCell",
  propTypes: {
    value: React.PropTypes.oneOf([0, 1]),
    position: React.PropTypes.number,
    updateBoard: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      updateBoard: R.always(undefined)
    };
  },
  updateBoard() {
    this.props.updateBoard(this.props.position);
  },
  render() {
    return (
      <span onClick={this.updateBoard} className="light-cell">
        {this.props.value}
      </span>
    );
  }
});

module.exports = LightCell;
