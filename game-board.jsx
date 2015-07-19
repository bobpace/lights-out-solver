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

var makeCell = R.curry((rowOffset, updateBoard, rowSolution, value, columnIndex) => {
  var position = rowOffset + columnIndex + 1;
  var cellSolution = rowSolution[columnIndex];
  var props = {key: columnIndex, updateBoard, value, position, cellSolution};
  return (
    <LightCell {... props} />
  );
});

var alwaysWinnableSizes = [2, 3, 6, 7, 8, 10, 12, 13, 15 /*, 18, 20, 21*/];

var GameBoard = React.createClass({
  displayName: "GameBoard",
  propTypes: {
    board: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    )
  },
  getInitialState() {
    var order = 3;
    return this.getBoardState(order);
  },
  getBoardState(order) {
    var board = randomBoardAsMatrix(order);
    var A = makeA(order);
    return {
      order,
      board,
      A,
      solution: this.findSolution(order, board, A)
    };
  },
  makeRow(row, rowIndex) {
    var rowOffset = this.state.order * rowIndex;
    var rowSolution = this.state.solution[rowIndex] || [];
    var cellMaker = makeCell(rowOffset, this.updateBoard, rowSolution);

    return (
      <div className="light-row" key={rowIndex} >
        {row.map(cellMaker)}
      </div>
    );
  },
  changeBoardSize(event) {
    var order = event.target.value;
    this.setState(this.getBoardState(order));
  },
  mapSizeOptions: R.map(
    (size) => <option value={size} key={size}>{size}</option>
  ),
  findSolution(order, board, A) {
    var b = Matrix.create(R.flatten(board));
    var x = solveForX(A, b);
    return columnVectorToMatrix(order, R.flatten(x.elements));
  },
  updateBoard(position) {
    var toggleForOrder = boardToggler(this.state.order);
    var toggleColumn = toggleForOrder(position);
    var newBoardState = toggleColumn(this.state.board);
    this.setState({
      board: newBoardState,
      solution: this.findSolution(this.state.order, newBoardState, this.state.A)
    });
  },
  render() {
    var selectBoardSize = (
      <select value={this.state.order} onChange={this.changeBoardSize}>
        {this.mapSizeOptions(alwaysWinnableSizes)}
      </select>
    );

    return (
      <div className="board">
        <div>
          {selectBoardSize}
        </div>
        {this.state.board.map(this.makeRow)}
      </div>
    );
  }
});

module.exports = GameBoard;
