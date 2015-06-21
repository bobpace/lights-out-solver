var R = require('ramda');
var {Matrix} = require('sylvester');

describe('can solve for square matrices', function() {
  var isInBounds = (rank) => (x) => x >= 0 && x < rank;

  //horizontally concat two matrices
  var hconcat = R.pipe(
    R.map(R.chain(R.identity)),
    R.converge(
      R.reduce((acc, x) => R.map(R.flatten, R.zip(acc, x))),
      R.head,
      R.tail
    )
  );

  var getRank = R.pipe(R.head, R.length);
  //finds indexes equal to 1 and sets their adjacent indexes to 1
  var placeValuesAdjacentToPivot = (matrixElements, pivotValue, adjacentValue) => {
    var matrix = R.clone(matrixElements);
    var rank = getRank(matrix);
    var findAdjacentIndexes = R.pipe(
      R.findIndex(R.equals(pivotValue)),
      (pivot) => [pivot - 1, pivot + 1],
      R.filter(isInBounds(rank))
    );
    var activateAdjacentToPivot = R.map((row) => {
      var updateRowIndex = R.forEach((index) => row[index] = adjacentValue);
      var updateAdjacentIndexes = R.pipe(findAdjacentIndexes, updateRowIndex);
      updateAdjacentIndexes(row);
      return row;
    });
    return activateAdjacentToPivot(matrix);
  };

  var makeA = (rank) => {
    var I = Matrix.I(rank).elements;
    var zero = Matrix.Zero(rank, rank).elements;
    var B = placeValuesAdjacentToPivot(I, 1, 1);
    var pivotB = R.map(R.map((x) => x ? B : zero), I);
    var A = placeValuesAdjacentToPivot(pivotB, B, I);
    return hconcat(A);
  };

  var mod2 = (x) => x % 2;

  //example when solving Ax=b for 3x3

  //9x9 matrix made up of 9 3x3 matrices
  //each column represents action of pressing switch at position
  //    B I 0
  //A = I B I
  //    0 I B

  //identity
  //    1 0 0
  //I = 0 1 0
  //    0 0 1

  //identity matrix with each adjacent index also active
  //to represent action of pressing a switch
  //    1 1 0
  //B = 1 1 1
  //    0 1 1

  //zero
  //    0 0 0
  //0 = 0 0 0
  //    0 0 0

  //example 3x3 board configuration
  //represents which lights are turned on to start
  //    0 1 0
  //b = 1 1 0
  //    0 1 1

  //solve for x and we have our strategy to turn the lights off
  it('3x3', function() {
    var A = Matrix.create(makeA(3));

    var boardConfiguration = R.flatten(
      [[0, 1, 0],
       [1, 1, 0],
       [0, 1, 1]]
    );
    var b = Matrix.create(boardConfiguration);
    var knownAnswer = Matrix.create([1, 1, 1, 0, 0, 0, 0, 0, 1]);

    //should be able to use the known answer to produce the board configuration
    A.multiply(knownAnswer).map(mod2).elements.should.eql(b.elements);

    //and also use the board configuration to find the answer
    var x = A.inv().round().multiply(b).map(mod2);
    x.should.eql(knownAnswer);
  });
});
