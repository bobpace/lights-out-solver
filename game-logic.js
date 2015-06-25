var R = require('ramda');
var {Matrix} = require('sylvester');

var isInBounds = (rank) => (x) => x >= 0 && x < rank;
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
  var assignAdjacentValuesToPivot = R.map((row) => {
    var setAdjacentValueAtIndexes = R.forEach((index) => row[index] = adjacentValue);
    var findAndSetAdjacentValuesForRow = R.pipe(
      findAdjacentIndexes,
      setAdjacentValueAtIndexes
    );
    findAndSetAdjacentValuesForRow(row);
    return row;
  });
  return assignAdjacentValuesToPivot(matrix);
};

//horizontally concat two matrices
var hconcat = R.pipe(
  R.map(R.chain(R.identity)),
  R.converge(
    R.reduce((acc, x) => R.map(R.flatten, R.zip(acc, x))),
    R.head,
    R.tail
  )
);

/**
 * Makes rank X rank matrix
 * with each column representing effect of pressing a light
 * @param {number} rank
 * @returns {Matrix}
 */
var makeA = (rank) => {
  var I = Matrix.I(rank).elements;
  var zero = Matrix.Zero(rank, rank).elements;
  var B = placeValuesAdjacentToPivot(I, 1, 1);
  var pivotB = R.map(R.map((x) => x ? B : zero), I);
  var A = placeValuesAdjacentToPivot(pivotB, B, I);
  return Matrix.create(hconcat(A));
};

var mod2 = (x) => x % 2;

var modinv = (a, m) => {
  var v = 1;
  var d = a;
  var u = (a === 1);
  var t = 1 - u;
  if (t === 1) {
    var c = m % a;
    u = Math.floor(m / a);
    while (c !== 1 && t === 1) {
      var q = Math.floor(d / c);
      d = d % c;
      v = v + q * u;
      t = (d !== 1);
      if (t === 1) {
        q = Math.floor(c / d);
        c = c % d;
        u = u + q * v;
      }
    }
    u = v * (1 - t) + t * (m - u);
  }
  return u;
};

/**
 * Solves Ax=b for Z2 field (0, 1 only valid values)
 * @param {Matrix} A
 * @param {Vector} b
 * @returns {Vector} x
 */
var solveForX = (A, b) => {
  //TODO: implement gaussian elimination mod 2

  //multiply regular inverse by determinant, round to integers
  //then multiply everything by the determinant's multiplicative inverse modulo 2
  var det = A.det();
  var multiplicativeInverseMod2 = modinv(det, 2);
  var invMod2 = A.inv()
        .multiply(det)
        .round()
        .multiply(multiplicativeInverseMod2)
        .map(R.compose(Math.abs, mod2));
  return invMod2.multiply(b).map(mod2);
};

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

/**
 * Logic to toggle board when pressing a particular light
 * give rank first, then give column, then finally current board state
 * @param {number} rank of matrix
 * @returns {function} (column) -> (board) -> [[]]
 */
var boardToggler = (rank) => {
  var A = makeA(rank);
  return (column) => {
    var col = A.col(column).elements;
    var mapIndexed = R.addIndex(R.map);
    var mapRowIndexes = R.map(R.__, R.range(0, rank));
    var indexModuloRank = R.pipe(R.last, (i) => i % rank);
    var columnToMatrix = R.pipe(
      mapIndexed((x, i) => [x, i]),
      R.groupBy(indexModuloRank),
      (groups) => mapRowIndexes((i) => mapRowIndexes((j) => groups[j][i][0]))
    );
    var toggleEffects = Matrix.create(columnToMatrix(col));
    return (board) => Matrix.create(board).add(toggleEffects).map(mod2).elements;
  };
};

module.exports = {
  makeA,
  solveForX,
  mod2,
  boardToggler
};
