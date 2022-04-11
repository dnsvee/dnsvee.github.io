// implements maze algorithms and a recursive backtracking solver
import { choice, shuffle } from './util.js';

(function() {		
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
	
	// A Maze is represented by a 2-dimensional array where Maze[y][x] is a code which describes
	// a room at location (x, y) and it's open corridors connecting the room with another room 
	// A room is described using a bitflag where
	// 0b0100 is an open corridor to the east
	// 0b0001 is an open corridor to the west
	// 0b1000 is an open corridor to the north
	// 0b0010 is an open corridor to the south
	
	// solver using backtracking (dfs)	
	// W is width
	// H is height
	// M is the maze	
	function solve(W, H, M) {
		// stack used for backtracking into previous room with unexplored corridors
		let S = []; 
		
		// call on each room and check each open corridor recursively
		// x1, y1: current location
		// x0, y0: previous location
		var solve_ = function(x0, y0, x1, y1, d) {
			if (x1 == W - 1 && y1 == H - 1) 
				return true;
			
			// Check each adjacent room 
			for (let e of [ [0b0100, 0b0001, x1 + 1, y1], [0b0001, 0b0100, x1 - 1, y1], [0b1000, 0b0010, x1, y1 - 1], [0b0010, 0b1000, x1, y1 + 1] ]) {

				// Coordinates fall outside the maze				
				if ( !(0 <= e[2] && e[2] < W && 0 <= e[3] && e[3] < H) ) 
					continue;

				// There is no corridor between the rooms								
				if ( !(M[e[3]][e[2]] & e[1]) || !(M[y1][x1] & e[0]) )
					continue;
			
				// Do not move back the way you came
				if ( (e[2] == x0 && e[3] == y0) ) 
					continue;

				// Try solve from this new position
				if (solve_(x1, y1, e[2], e[3])) {
					S.push([e[2], e[3]]);
					return true;
				};
			};
			return false;
		}

		// start in the upper left corner
		solve_(-1, -1, 0, 0);
		return S;
	}
 
	// Draws a maze using unicode symbols into the div named by 'i'
	// 'f' is the function that creates the maze
	function drawmaze(W, H, i, createMaze) {
		let c = document.querySelector(i).getContext('2d');
		let M = [];
		
		for(let y = 0; y < H; y++) 
			M.push(new Array(W).fill(0));
				
		// create maze
		createMaze(W, H, M);

		// solve maze
		// return value is a stack of cells that forms the path from start to finish
		let s = solve(W, H, M);

		c.textBaseline = 'top';
		c.font         = '16px monospace';

		// mapping of codes to symbol for drawing the maze on screen
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

	// kruskals method of maze generation using a modified random spanning tree algorithm		
	function kruskal(W, H, M) {		
		// List of all edges/corridors possible in the maze
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

		// S is a list that keeps track of which rooms are connected using
		// the disjointed set/union find algorithm		
		let S = [];

		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W; x++) {
				let a = BigInt(y) * BigInt(W) + BigInt(x);
				S[a] = a;
			}
		}

		// implement union-find algorithm		
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

		// shuffle all edges
		shuffle(E);

		// iterate over all edges and create a corridor if the two rooms formed by the
		// edge if they are not reachable by an existing path		
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

	
	function backtrack(W, H, M) {
		// backtracking method of maze generation
		// start with some cell; create an edge with another room that has not been visited
		// mark this room as the current room and repeat this process from the new room
		
		// starting point
		let x = 0, y = 0; 

		// stack of points being visited
		let cells = [];
		while (true) {
			let L = []; // L is a list of possible edges to visit

			// From the current room check which of the surrounding rooms have not be
			// visited yet. Add them to L.			
			if ((x < W - 1) && M[y][x + 1] === 0) 
				L.push([x + 1, y, 4, 1]);

			if ((x > 0) && M[y][x - 1] === 0) 
				L.push([x - 1, y, 1, 4]);

			if ((y < H - 1) && M[y + 1][x] === 0) 
				L.push([x, y + 1, 2, 8]);

			if ((y > 0) && M[y - 1][x] === 0) 
				L.push([x, y - 1, 8, 2]);

			if (L.length) {
				// select an unvisited room at random
				let i = choice(L);
				let [x0, y0, v, v0] = i;
								
				// create an edge
				M[y ][x ] |= v; 
				M[y0][x0] |= v0;  
				
				cells.push([x, y]);
				
				x = x0;
				y = y0;
				continue;
			}

			// done
			if (!cells.length) 
				break;

			// visit next room
			[x, y] = cells.pop();
		}
	}

	function recdiv(W, H, M) {		
		// recursively divide the maze into two rooms connected by a single edge
		// recursively repeat this process on each resulting room
		
		// initialize the array with closed rooms with no edges
		for(let y = 0; y < H; y++) 
			M.push(new Array(W).fill(0));

		// create a border around the maze 
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

		// keep dividing rooms and stop when the rooms are too small		
		function recdiv(w0, w1, h0, h1) {
			let W = w1 - w0;
			let H = h1 - h0;

			if (W >= 1 && H >= 1) {
				let wx = randomInt(w1, w0);
				let hx = randomInt(h1, h0);

				// divide vertical if room height greater than width
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

					// divide this room further
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

					// divide this room further
					recdiv(w0, w1, h0, hx);
					recdiv(w0, w1, hx + 1, h1);
				}
			}
		}

		// first call; start with the entire maze 
		recdiv(0, W - 1, 0, H - 1);
	};

	// size of maze
	let W = 50; 
	let H = 30;

	// solve and draw each maze
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

	hljs.highlightAll();

})();

