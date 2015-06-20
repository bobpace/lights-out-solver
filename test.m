A = eye(5);
disp(A);
printf('\n');


b = [1, 1, 0, 0, 0; 1, 1, 1, 0, 0; 0, 1, 1, 1, 0; 0, 0, 1, 1, 1; 0, 0, 0, 1, 1];
disp(b);
printf('\n');

c = [0, 1, 0, 0, 0; 1, 0, 1, 0, 0; 0, 1, 0, 1, 0; 0, 0, 1, 0, 1; 0, 0, 0, 1, 0];
disp(c);
printf('\n');

disp(A + c)
printf('\n');

x = b \ A;
disp(x)
printf('\n');
