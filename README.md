***
Lights out puzzle game solver

This was a fun challenge. I hope it is useful to others who want to improve their understanding of the following concepts:

* Linear algebra
* Functional programming
* ES6 javascript
* Front end development with React.js and webpack
* Test converage with Mocha and Karma

The implementation is according to the following excellent resource:
http://www.math.ksu.edu/math551/math551.s07/lights_out.pdf

example when solving Ax=b for 3x3

9x9 matrix made up of 9 3x3 matrices
each column represents action of pressing switch at position
    B I 0
A = I B I
    0 I B

identity
    1 0 0
I = 0 1 0
    0 0 1

identity matrix with each adjacent index also active
    1 1 0
B = 1 1 1
    0 1 1

zero
    0 0 0
0 = 0 0 0
    0 0 0

example 3x3 board configuration
represents which lights are turned on to start
    0 1 0
b = 1 1 0
    0 1 1

  1 1 0 1 0 0 0 0 0    ?      0
  1 1 1 0 1 0 0 0 0    ?      1
  0 1 1 0 0 1 0 0 0    ?      0
  1 0 0 1 1 0 1 0 0    ?      1
A 0 1 0 1 1 1 0 1 0  x ?  = b 1
  0 0 1 0 1 1 0 0 1    ?      0
  0 0 0 1 0 0 1 1 0    ?      0
  0 0 0 0 1 0 1 1 1    ?      1
  0 0 0 0 0 1 0 1 1    ?      1

each row in b corresponds to a column in A

All math operations are in Z2 number field (0, 1) so everything is modulo 2
Invert A and multiply it by A to remove it from left side
Apply same operation to right side
x = A⁻¹b

solve for x and we have our strategy to turn the lights off
