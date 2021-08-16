// utilities
//
export { between, randint, choice, shuffle };

function shuffle(a) {
	var c, x;
	for(let i = a.length - 1; i >= 1; i--) {
		c = ~~Math.random() * (i + 1);
		x    = a[i];
		a[i] = a[c];
		a[c] = x;
	}
	return a;
}

function choice(a) {
	let i = Math.floor(Math.random() * a.length);
	return a[i];
}

function randint(a, b) {
	return Math.floor((b - a) * Math.random() + a);
}

function between(x, a, b) {
	return x >= a && x < b;
}


