var React = require('react');
var LightCell = require('./light-cell');
var R = require('ramda');
var {Matrix} = require('sylvester');
var {
  boardToggler,
  makeA,
  solveForX
} = require('./game-logic');

var makeCell = R.curry((rowOffset, updateBoard, value, columnIndex) => {
  var position = rowOffset + columnIndex + 1;
  var props = {key: columnIndex, updateBoard, value, position};
  return (
    <LightCell {... props} />
  );
});

var GameBoard = React.createClass({
  displayName: "GameBoard",
  propTypes: {
    board: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    )
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
    var boardColumnVector = Matrix.create(R.flatten(this.state.board));
    var solution = solveForX(this.state.A, boardColumnVector);
    console.log(R.flatten(solution.elements));
  },
  updateBoard(position) {
    var toggleFor3 = boardToggler(3);
    var toggleColumn = toggleFor3(position);
    var newBoardState = toggleColumn(this.state.board);
    this.setState({board: newBoardState});
  },
  getInitialState() {
    var rank = 3;
    var A = makeA(rank);
    var board = Matrix.Random(9, 1).round();
    console.log(board.elements);
    return {
      board: [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      rank: rank,
      A: A
    };
  },
  render() {
    return (
      <div>
        {this.state.board.map(this.makeRow)}
        <input type="button" style={{width: 200}} value="Solve" onClick={this.findSolution}/>
      </div>
    );
  }
});

module.exports = GameBoard;
