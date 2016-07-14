/**
 * Polyfills for hyperbolic functions
 */

"use strict";

Math.sinh = Math.sinh || function(x) {
	var y = Math.exp(x);
	return (y - 1 / y) / 2;
};

Math.cosh = Math.cosh || function(x) {
	var y = Math.exp(x);
	return (y + 1 / y) / 2;
};

Math.tanh = Math.tanh || function(x) {
	if (x === Infinity) {
		return 1;
	} else if (x === -Infinity) {
		return -1;
	} else {
		var y = Math.exp(2 * x);
		return (y - 1) / (y + 1);
	}
};

Math.asinh = Math.asinh || function(x) {
	if (x === -Infinity) {
		return x;
	} else {
		return Math.log(x + Math.sqrt(x * x + 1));
	}
};

Math.acosh = Math.acosh || function(x) {
	return Math.log(x + Math.sqrt(x * x - 1));
};

Math.atanh = Math.atanh || function(x) {
	return Math.log((1 + x) / (1 - x)) / 2;
};
