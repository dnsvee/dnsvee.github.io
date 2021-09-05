// implements maze algorithms and a recursive backtracking algo that solves it
import { choice, shuffle } from './util.js';
(function() {
	// implements some maze algorithms and a recursive backtracker for solving them
	function randomInt(max, min=0) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	// integer division
	function idiv(d, n) {
		return Math.floor(d / n);
	}

	// shuffle an array
	function shuffle(a) {
		for(let i = a.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let x = a[i];
			a[i] = a[j];

			a[j] = x;
		}
	}

	// solves a maze using backtracking and recursion
	function solve(W, H, M) {
		let S = [];
		var solve_ = function(x0, y0, x1, y1, d) {
			if (x1 == W - 1 && y1 == H - 1) 
				return true;

			for (let e of [ [0b0100, 0b0001, x1 + 1, y1], [0b0001, 0b0100, x1 - 1, y1], [0b1000, 0b0010, x1, y1 - 1], [0b0010, 0b1000, x1, y1 + 1] ]) {

				// not inside maze
				if ( !(0 <= e[2] && e[2] < W && 0 <= e[3] && e[3] < H) ) 
					continue;

				// no connection
				if ( !(M[e[3]][e[2]] & e[1]) || !(M[y1][x1] & e[0]) )
					continue;
			
				// avoid moving back the same way
				if ( (e[2] == x0 && e[3] == y0) ) 
					continue;

				// recur
				if (solve_(x1, y1, e[2], e[3])) {
					S.push([e[2], e[3]]);
					return true;
				};
			};
			return false;
		}

		solve_(-1, -1, 0, 0);
		return S;
	}

	// draw a maze usign unicode symbols into the div named by 'i'
	// 'i' is the id of the canvas to draw unto
	// 'f' is the function that creats the maze
	function drawmaze(W, H, i, f) {
		let c = document.querySelector(i).getContext('2d');
		let M = [];
		for(let y = 0; y < H; y++) {
			M.push(new Array(W).fill(0));
		}

		f(W, H, M);

		let s = solve(W, H, M);

		c.textBaseline = 'top';
		c.font         = '16px monospace';

		let arr = new Array(16).fill(0);
		arr[0b0000] = ' ';
		arr[0b0001] = '╸';
		arr[0b0010] = '╻';
		arr[0b0100] = '╺';
		arr[0b1000] = '╹';
		arr[0b0011] = '┓';
		arr[0b0101] = '━';
		arr[0b0110] = '┏';
		arr[0b1001] = '┛';
		arr[0b1010] = '┃';
		arr[0b1100] = '┗';
		arr[0b0111] = '┳';
		arr[0b1011] = '┫';
		arr[0b1101] = '┻';
		arr[0b1110] = '┣';
		arr[0b1111] = '╋';

		let syms = arr.join('');

		// draw the maze
		c.fillStyle = 'black';
		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W; x++) {
				c.fillText(syms[M[y][x]], x * 10, y * 16);
			}
		}

		// draw the solution
		c.fillStyle = 'red';
		c.fillText(syms[M[0][0]], 0, 0);
		s.push([W - 1, H - 1]);
		while (s.length) {
			let [x, y] = s.pop();
			c.fillText(syms[M[y][x]], x * 10, y * 16);
		}
	}

	// kruskals method of maze generation; random spanning tree generation
	function kruskal(W, H, M) {
		let E = []
		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W - 1; x++) {
				E.push({ x0: x, y0: y, x1: x + 1, y1: y})
			}
		}

		for(let y = 0; y < H - 1; y++) {
			for(let x = 0; x < W; x++) {
				E.push({ x0: x, y0: y, x1: x, y1: y + 1})
			}
		}

		let S = [];

		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W; x++) {
				let a = BigInt(y) * BigInt(W) + BigInt(x);
				S[a] = a;
			}
		}

		function root(x, y) {
			let t = BigInt(y) * BigInt(W) + BigInt(x);
			while (S[t] != t) {
				t = S[t];
			}
			return t;
		}

		function union(x0, y0, x1, y1) {
			let r0 = root(x0, y0);
			let r1 = root(x1, y1);
			if (r0 != r1) {
				S[r1] = r0;
				return true;
			}
			return false;
		}

		shuffle(E);
		for (let e of E) {
			if (union(e.x0, e.y0, e.x1, e.y1)) {
				if (e.x0 == e.x1) {
					M[e.y0][e.x0] = M[e.y0][e.x0]   | 0b0010;
					M[e.y1][e.x1] = M[e.y1][e.x1] | 0b1000;
				} else {
					M[e.y0][e.x0] = M[e.y0][e.x0]   | 0b0100;
					M[e.y1][e.x1] = M[e.y1][e.x1] | 0b0001;
				}
			}
		}
	}

	// backtracking method; pick an unvisited cell
	// at random
	function backtrack(W, H, M) {
		let x = 0, y = 0;

		let cells = [];
		while (true) {
			let L = [];
			if ((x < W - 1) && M[y][x + 1] === 0) L.push([x + 1, y, 4, 1]);
			if ((x > 0)     && M[y][x - 1] === 0) L.push([x - 1, y, 1, 4]);
			if ((y < H - 1) && M[y + 1][x] === 0) L.push([x, y + 1, 2, 8]);
			if ((y > 0)     && M[y - 1][x] === 0) L.push([x, y - 1, 8, 2]);

			if (L.length) {
				let i = choice(L);
				let [x0, y0, v, v0] = i;
				M[y ][x ] |= v;
				M[y0][x0] |= v0;
				cells.push([x, y]);
				x = x0;
				y = y0;
				continue;
			}

			if (!cells.length) break;

			[x, y] = cells.pop();
		}
	}

	// recursive division method
	function recdiv(W, H, M) {
		for(let y = 0; y < H; y++) {
			M.push(new Array(W).fill(0));
		}

		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				let v = 0b1111;
				if (y == 0 ) 	v = v & 0b0111;
				if (y == H - 1) v = v & 0b1101;
				if (x == 0)     v = v & 0b1110;
				if (x == W - 1) v = v & 0b1011;
				M[y][x] = v;
			}
		}

		function recdiv(w0, w1, h0, h1) {
			let W = w1 - w0;
			let H = h1 - h0;

			if (W >= 1 && H >= 1) {
				let wx = randomInt(w1, w0);
				let hx = randomInt(h1, h0);
				if (W >= H) {
					for(let i = h0; i <= h1; i++) {
						let v0 = M[i][wx];
						let v1 = M[i][wx + 1];

						if (i != hx) { 
							v0 = v0 & 0b1011;
							v1 = v1 & 0b1110;
						}

						M[i][wx]     = v0;
						M[i][wx + 1] = v1;
					}

					recdiv(w0,     wx, h0, h1);
					recdiv(wx + 1, w1, h0, h1);
				} else {
					for(let i = w0; i <= w1; i++) {
						let v0 = M[hx    ][i];
						let v1 = M[hx + 1][i];

						if (i != wx) {
							v0 = v0 & 0b1101;
							v1 = v1 & 0b0111;
						}
						M[hx    ][i] = v0;
						M[hx + 1][i] = v1;
					}

					recdiv(w0, w1, h0, hx);
					recdiv(w0, w1, hx + 1, h1);
				}
			}
		}

		recdiv(0, W - 1, 0, H - 1);
	};

	let W = 50; //Math.floor(640 / 10);
	let H = 30;

	drawmaze(W, H, '#kruskal_canvas', kruskal);
	drawmaze(W, H, '#division_canvas', recdiv);
	drawmaze(W, H, '#backtracking_canvas', backtrack);

	let id;
	id = document.querySelector('#kruskalsrc');
	id.innerHTML = `<pre><code>${kruskal.toString()}</code></pre>`;

	id = document.querySelector('#recbacksrc');
	id.innerHTML = `<pre><code>${backtrack.toString()}</code></pre>`;

	id = document.querySelector('#divmethsrc');
	id.innerHTML = `<pre><code>${recdiv.toString()}</code></pre>`;

//	id = document.querySelector('#heapsort_source');
//	id.innerHTML = '<pre><code>' + heapify.toString() + '\n\n' + makeheap.toString() + '\n\n' + heapsort.toString() + '</code></pre>';

	hljs.highlightAll();

})();

