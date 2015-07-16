var React = require('react');
var LightCell = require('./light-cell');
var R = require('ramda');
var {Matrix} = require('sylvester');
var {
  boardToggler,
  makeA,
  solveForX,
  randomBoardAsMatrix,
  columnVectorToMatrix
} = require('./game-logic');

var makeCell = R.curry((rowOffset, updateBoard, value, columnIndex) => {
  var position = rowOffset + columnIndex + 1;
  var props = {key: columnIndex, updateBoard, value, position};
  return (
    <LightCell {... props} />
  );
});

//TODO: combo box to select size of board
let alwaysWinnable = [2, 3, 6, 7, 8, 10, 12, 13, 15 /*, 18, 20, 21*/];

//TODO: overlay solution onto board
var GameBoard = React.createClass({
  displayName: "GameBoard",
  propTypes: {
    board: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    )
  },
  getInitialState() {
    var order = 10;
    var board = randomBoardAsMatrix(order);
    var A = makeA(order);
    return {order, board, A, solution: []};
  },
  makeRow(row, rowIndex) {
    var numCols = R.length(row);
    return (
      <div className="light-row" key={rowIndex} >
        {row.map(makeCell(numCols * rowIndex, this.updateBoard))}
      </div>
    );
  },
  findSolution() {
    var b = Matrix.create(R.flatten(this.state.board));
    var x = solveForX(this.state.A, b);
    var solution = columnVectorToMatrix(this.state.order, R.flatten(x.elements));
    this.setState({solution});
  },
  updateBoard(position) {
    var toggleForOrder = boardToggler(this.state.order);
    var toggleColumn = toggleForOrder(position);
    var newBoardState = toggleColumn(this.state.board);
    this.setState({board: newBoardState});
  },
  render() {
    return (
      <div className="noselect">
        {this.state.board.map(this.makeRow)}
        <input type="button" style={{width: 200}} value="Solve" onClick={this.findSolution}/>
        {this.state.solution.map((x) => <div>{x}</div>)}
      </div>
    );
  }
});

module.exports = GameBoard;
