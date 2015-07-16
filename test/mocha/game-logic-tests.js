var R = require('ramda');
var {Matrix} = require('sylvester');

var {
  makeA,
  solveForX,
  mapZ2,
  boardToggler,
  randomBoardAsColumnVector,
  randomBoardAsMatrix
} = require('../../game-logic');

describe("lights out game logic", function() {

  describe("can press a light and update the board", function() {
    var toggleForRank3 = boardToggler(3);
    var board = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 1]
    ];
    var assertColumnToggleChanges = (columnNumber, value) => {
      var toggleColumn = toggleForRank3(columnNumber);
      var result = toggleColumn(board);
      result.should.eql(value);
    };

    it("upper left", function() {
      assertColumnToggleChanges(
        1,
        [[1, 0, 0],
         [0, 1, 0],
         [0, 1, 1]]
      );
    });

    it("upper center", function() {
      assertColumnToggleChanges(
        2,
        [[1, 0, 1],
         [1, 0, 0],
         [0, 1, 1]]
      );
    });

    it("upper right", function() {
      assertColumnToggleChanges(
        3,
        [[0, 0, 1],
         [1, 1, 1],
         [0, 1, 1]]
      );
    });

    it("middle left", function() {
      assertColumnToggleChanges(
        4,
        [[1, 1, 0],
         [0, 0, 0],
         [1, 1, 1]]
      );
    });

    it("middle center", function() {
      assertColumnToggleChanges(
        5,
        [[0, 0, 0],
         [0, 0, 1],
         [0, 0, 1]]
      );
    });

    it("middle right", function() {
      assertColumnToggleChanges(
        6,
        [[0, 1, 1],
         [1, 0, 1],
         [0, 1, 0]]
      );
    });

    it("lower left", function() {
      assertColumnToggleChanges(
        7,
        [[0, 1, 0],
         [0, 1, 0],
         [1, 0, 1]]
      );
    });

    it("lower center", function() {
      assertColumnToggleChanges(
        8,
        [[0, 1, 0],
         [1, 0, 0],
         [1, 0, 0]]
      );
    });

    it("lower right", function() {
      assertColumnToggleChanges(
        9,
        [[0, 1, 0],
         [1, 1, 1],
         [0, 0, 0]]
      );
    });
  });

  describe("can make a random board", function() {
    var isArray = R.is(Array);

    var canMakeBoard = (order) => {
      var board = randomBoardAsMatrix(order);
      isArray(board).should.be.true();
      var rowIndexes = R.range(0, order);
      R.forEach((i) => isArray(board[i]).should.be.true(), rowIndexes);
      var isValidValue = R.contains(R.__, [0, 1]);
      R.forEach(isValidValue, R.flatten(board));
    };

    it("2x2", function() {
      canMakeBoard(2);
    });

    it("3x3", function() {
      canMakeBoard(3);
    });

    it("4x4", function() {
      canMakeBoard(4);
    });
  });

  describe('can solve square matrices', function() {

    it('can solve specific 3x3', function() {
      var A = makeA(3);

      //turn the 3x3 board configuration into a 9x1 column vector
      var boardConfiguration = R.flatten(
        [[0, 1, 0],
         [1, 1, 0],
         [0, 1, 1]]
      );
      var b = Matrix.create(boardConfiguration);
      //express the known answer as a 9x1 column vector
      var knownAnswer = Matrix.create([1, 1, 1, 0, 0, 0, 0, 0, 1]);

      //use the known answer to produce the board configuration starting from all lights off
      mapZ2(A.multiply(knownAnswer)).elements.should.eql(b.elements);

      //and also use the board configuration to find the answer that will put it back to all lights off
      var x = solveForX(A, b);
      x.should.eql(knownAnswer);
    });

    let solveRandom = (order) => {
      var A = makeA(order);
      var b = randomBoardAsColumnVector(order);
      var x = solveForX(A, b);
      mapZ2(A.multiply(x)).should.eql(b);
    };

    //If the dimension of the null space is zero
    //then every configuration is winnable and the solution is unique

    //otherwise configurations are only winnable
    //if b is perpendicular to the null space columns

    // A = n x n
    // n  - Null(A)
    // 2  - 0
    // 3  - 0
    // 4  - 4
    // 5  - 2
    // 6  - 0
    // 7  - 0
    // 8  - 0
    // 9  - 8
    // 10 - 0
    // 11 - 6
    // 12 - 0
    // 13 - 0
    // 14 - 4
    // 15 - 0
    // 16 - 8
    // 17 - 2
    // 18 - 0
    // 19 - 16
    // 20 - 0
    // 21 - 0

    describe("can always win when dimension of null space is 0", function() {
      it("2", function() {
        solveRandom(2);
      });

      it("3", function() {
        solveRandom(3);
      });

      it("6", function() {
        solveRandom(6);
      });

      it("7", function() {
        solveRandom(7);
      });

      it("8", function() {
        solveRandom(8);
      });

      it("10", function() {
        solveRandom(10);
      });

      it("12", function() {
        solveRandom(12);
      });

      it("13", function() {
        solveRandom(13);
      });

      //15, 18, 20, and 21 take longer than 2 seconds to run so leaving them out
    });
  });
});
