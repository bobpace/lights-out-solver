***
Lights out puzzle game solver

This was a fun challenge. I hope it is useful to others who want to improve their understanding of the following concepts:

* Linear algebra
* Functional programming
* ES6 javascript
* Front end development with React.js and webpack
* Test coverage with Mocha and Karma

The implementation is according to the following excellent resource:
http://www.math.ksu.edu/math551/math551.s07/lights_out.pdf

Example when solving Ax=b for 3x3

A is a 9x9 matrix made up of 9 3x3 matrices, each of which is either B, I, or 0

I = identity matrix

B = identity matrix with adjacent positions to pivots also active

0 = matrix of all zeros

|Matrix| | | |
|---|---|---|---|
|   | B | I | 0 |
|A  | I | B | I |
|   | 0 | I | B |
|   |   |   |   |
|   | 1 | 0 | 0 |
|I  | 0 | 1 | 0 |
|   | 0 | 0 | 1 |
|   |   |   |   |
|   | 1 | 1 | 0 |
|B  | 1 | 1 | 1 |
|   | 0 | 1 | 1 |
|   |   |   |   |
|   | 0 | 0 | 0 |
|0  | 0 | 0 | 0 |
|   | 0 | 0 | 0 |

Here is an example 3x3 board configuration which we need to solve
1 represents the light on at a position, 0 is off

|     |   |   |   |
|-----|---|---|---|
|     | 0 | 1 | 0 |
|board| 1 | 1 | 0 |
|     | 0 | 1 | 1 |

We turn the board into a 9x1 column vector and it becomes b in our Ax=b problem

| | | | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|   | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |   | ? |   | 0 |
|   | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 0 |   | ? |   | 1 |
|   | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |   | ? |   | 0 |
|   | 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | 0 |   | ? |   | 1 |
|A  | 0 | 1 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | x | ? | b | 1 |
|   | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 1 |   | ? |   | 0 |
|   | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 0 |   | ? |   | 0 |
|   | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 1 |   | ? |   | 1 |
|   | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 |   | ? |   | 1 |

Each row in b corresponds to a column in A

Each column of A represents the action of pressing the switch at its index position in the original board

All math operations are in Z2 number field (0, 1) so everything is modulo 2

Solve for x and we have our strategy to turn the lights off

Invert the matrix A and multiply its inverse by itself to remove it from left side

Apply the same operation to the right side

x = A⁻¹b
