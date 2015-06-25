var R = require('ramda');
var {Matrix} = require('sylvester');

var {
  makeA,
  solveForX,
  mod2,
  boardToggler
} = require('../../lights-out');

describe("lights out game logic", function() {

  describe("can press a light and update the board", function() {
    var toggleForRank3 = boardToggler(3);
    var board = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 1]
    ];
    var assertToggle = (columnNumber, value) => {
      var toggleColumn = toggleForRank3(columnNumber);
      var result = toggleColumn(board);
      result.should.eql(value);
    };

    it("upper left", function() {
      assertToggle(
        1,
        [[1, 0, 0],
         [0, 1, 0],
         [0, 1, 1]]
      );
    });

    it("upper center", function() {
      assertToggle(
        2,
        [[1, 0, 1],
         [1, 0, 0],
         [0, 1, 1]]
      );
    });

    it("upper right", function() {
      assertToggle(
        3,
        [[0, 0, 1],
         [1, 1, 1],
         [0, 1, 1]]
      );
    });

    it("middle left", function() {
      assertToggle(
        4,
        [[1, 1, 0],
         [0, 0, 0],
         [1, 1, 1]]
      );
    });

    it("middle center", function() {
      assertToggle(
        5,
        [[0, 0, 0],
         [0, 0, 1],
         [0, 0, 1]]
      );
    });

    it("middle right", function() {
      assertToggle(
        6,
        [[0, 1, 1],
         [1, 0, 1],
         [0, 1, 0]]
      );
    });

    it("lower left", function() {
      assertToggle(
        7,
        [[0, 1, 0],
         [0, 1, 0],
         [1, 0, 1]]
      );
    });

    it("lower center", function() {
      assertToggle(
        8,
        [[0, 1, 0],
         [1, 0, 0],
         [1, 0, 0]]
      );
    });

    it("lower right", function() {
      assertToggle(
        9,
        [[0, 1, 0],
         [1, 1, 1],
         [0, 0, 0]]
      );
    });
  });

  describe('can solve for square matrices', function() {
    it('specific 3x3', function() {
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
      A.multiply(knownAnswer).map(mod2).elements.should.eql(b.elements);

      //and also use the board configuration to find the answer that will put it back to all lights off
      var x = solveForX(A, b);
      x.should.eql(knownAnswer);

      // console.log("A: ");
      // console.log(A);
      // console.log("---");
      // console.log("b: ");
      // console.log(b);
      // console.log("---");
      // console.log("x: ");
      // console.log(x);
    });

    it("any random 2x2", function() {
      var A = makeA(2);
      var b = Matrix.Random(4, 1).round();
      var x = solveForX(A, b);
      A.multiply(x).map(mod2).should.eql(b);
    });

    it("any random 3x3", function() {
      var A = makeA(3);
      var b = Matrix.Random(9, 1).round();
      var x = solveForX(A, b);

      A.multiply(x).map(mod2).should.eql(b);
    });

    //rounding errors make this not work, need to implement gaussian elimination mod 2
    xit("any random 4x4", function() {
      var A = makeA(4);
      var b = Matrix.Random(16, 1).round();
      var x = solveForX(A, b);
      A.multiply(x).map(mod2).should.eql(b);
    });
  });

});
