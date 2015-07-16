var R = require('ramda');
var {Matrix} = require('sylvester');

var isInBounds = (order) => (x) => x >= 0 && x < order;
var determineOrderFor = R.pipe(R.head, R.length);
//finds indexes equal to 1 and sets their adjacent indexes to 1
var placeValuesAdjacentToPivot = (matrixElements, pivotValue, adjacentValue) => {
  var matrix = R.clone(matrixElements);
  var order = determineOrderFor(matrix);
  var findAdjacentIndexes = R.pipe(
    R.findIndex(R.equals(pivotValue)),
    (pivot) => [pivot - 1, pivot + 1],
    R.filter(isInBounds(order))
  );
  var assignAdjacentValuesToPivot = R.map((row) => {
    var findAndSetAdjacentValuesForRow = R.pipe(
      findAdjacentIndexes,
      R.forEach((index) => row[index] = adjacentValue)
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
 * Makes n X n matrix
 * with each column representing the effect of pressing one light
 * @param {number} order
 * @returns {Matrix}
 */
var makeA = (order) => {
  var I = Matrix.I(order).elements;
  var zero = Matrix.Zero(order, order).elements;
  var B = placeValuesAdjacentToPivot(I, 1, 1);
  var pivotB = R.map(R.map((x) => x ? B : zero), I);
  var A = placeValuesAdjacentToPivot(pivotB, B, I);
  return Matrix.create(hconcat(A));
};

var mod2 = (x) => x % 2;
var toZ2 = R.pipe(mod2, Math.abs);
var mapZ2 = (matrix) => matrix.map(toZ2);

//toRightTriangular function from sylvester library modified for Z2
var toRightTriangularZ2 = (matrix) => {
  var M = matrix.dup(), els;
  var n = matrix.elements.length, i, j, np = matrix.elements[0].length, p;
  for (i = 0; i < n; i++) {
    if (M.elements[i][i] === 0) {
      for (j = i + 1; j < n; j++) {
	if (M.elements[j][i] !== 0) {
          els = [];
          for (p = 0; p < np; p++) { els.push(toZ2(M.elements[i][p] + M.elements[j][p])); }
          M.elements[i] = els;
          break;
	}
      }
    }
    if (M.elements[i][i] !== 0) {
      for (j = i + 1; j < n; j++) {
	var multiplier = M.elements[j][i];
	els = [];
	for (p = 0; p < np; p++) {
          els.push(p <= i ? 0 : toZ2(M.elements[j][p] - M.elements[i][p] * multiplier));
	}
	M.elements[j] = els;
      }
    }
  }
  return M;
};

//inverse function from sylvester library modified for Z2
var inverseZ2 = (matrix) => {
  if (!matrix.isSquare() || matrix.isSingular()) { return null; }
  var n = matrix.elements.length, i = n, j;
  var M = toRightTriangularZ2(matrix.augment(Matrix.I(n)));
  var np = M.elements[0].length, p, els;
  var inverseElements = [], newElement;
  while (i--) {
    els = [];
    inverseElements[i] = [];
    for (p = 0; p < np; p++) {
      newElement = M.elements[i][p];
      els.push(newElement);
      if (p >= n) { inverseElements[i].push(newElement); }
    }
    M.elements[i] = els;
    j = i;
    while (j--) {
      els = [];
      for (p = 0; p < np; p++) {
	els.push(toZ2(M.elements[j][p] - M.elements[i][p] * M.elements[j][i]));
      }
      M.elements[j] = els;
    }
  }
  return Matrix.create(inverseElements);
};

/**
 * Solves Ax=b for Z2 field (0, 1 only valid values)
 * @param {Matrix} A
 * @param {Vector} b
 * @returns {Vector} x
 */
var solveForX = (A, b) => {
  var invZ2 = inverseZ2(A);
  return mapZ2(invZ2.multiply(b));
};

var mapIndexed = R.addIndex(R.map);

var columnVectorToMatrix = R.curry((order, columnVector) => {
  var mapIndexes = R.map(R.__, R.range(0, order));
  var indexModuloRank = R.pipe(R.last, (i) => i % order);
  var formMatrixFrom = R.pipe(
    R.flatten,
    mapIndexed((x, i) => [x, i]),
    R.groupBy(indexModuloRank),
    (groups) => mapIndexes((i) => mapIndexes((j) => groups[j][i][0]))
  );
  return formMatrixFrom(columnVector);
});

/**
 * Logic to toggle board when pressing a particular light
 * Moves are made by matrix addition in Z2, adding the effects of
 * pressing a cell to the existing board state
 * @param {number} order - n X n
 * @param {number} cellNumber - position of light pressed
 * corresponds to column in A containing effects of pressing that light
 * @param {Array[Array[number]]} board - current board
 * @returns {Array[Array[number]]} updated board state
 */
var boardToggler = R.curry((order, cellNumber, board) => {
  var A = makeA(order);
  var columnVector = A.col(cellNumber).transpose().elements;
  var toggleEffects = Matrix.create(columnVectorToMatrix(order, columnVector));
  var toggledMatrix = Matrix.create(board).add(toggleEffects);
  return mapZ2(toggledMatrix).elements;
});

var randomBoardAsColumnVector = (order) => {
  var size = Math.pow(order, 2);
  return Matrix.Random(size, 1).round();
};

var randomBoardAsMatrix = (order) => {
  var columnVector = randomBoardAsColumnVector(order);
  return columnVectorToMatrix(order, columnVector.elements);
};

module.exports = {
  makeA,
  solveForX,
  mapZ2,
  boardToggler,
  columnVectorToMatrix,
  randomBoardAsColumnVector,
  randomBoardAsMatrix
};
