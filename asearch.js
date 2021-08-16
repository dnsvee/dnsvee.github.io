// demonstration of A* search algorithm
//
import { between, randint, shuffle } from './util.js'

(function() {
	let wid = document.querySelector('#wrap');

	// size of grid
	let W  = 32;
	let H  = 32;

	// start at 0, 0; find a path toward 31, 31

	// table to use as display
	let t = [];
	for(let y = 0; y < H; y++) {
		t.push('<tr>');
		for(let x = 0; x < W; x++) {
			t.push('<td>.</td>');
		}
		t.push('</tr>');
	}

	wid.innerHTML = t.join('');

	// heuristic function for asearch
	let heur = (i) => i.cost + 4 * Math.abs(W - 1 - i.x) + 4 * Math.abs(H - 1 - i.y);

	// use manhattan distance as heuristic ofr priority queue  
	let cmp = (e0, e1) => heur(e0) < heur(e1);

	// priority queue
	class PQ {
		constructor() {
			this.arr = [];
			this.d = false;
		}

		// pop element with least priority
		pop() {
			if (this.arr.length == 0) 
				throw "Exception in PQ: Pq.pop(), queue empty";

			let a = this.arr[0];
			if (a.x == 24 && a.y == 22) this.d = true;

			a.infrontier = 0;

			this.arr[0] = this.arr.pop();
			this.arr[0].pos = 0;

			this.heapify(1);

			return a;
		}

		// move element down from root to correct location
		heapify(i) {
			let j = i;

			if (i * 2     <= this.arr.length && cmp(this.arr[i * 2 - 1], this.arr[i - 1]))
				j = i * 2;

			if (i * 2 + 1 <= this.arr.length && cmp(this.arr[i * 2    ], this.arr[j - 1]))
				j = i * 2 + 1;

			if (i == j) return;

			let t = this.arr[j - 1];
			this.arr[j - 1] = this.arr[i - 1]
			this.arr[i - 1] = t;

			this.arr[j - 1].pos = j - 1;
			this.arr[i - 1].pos = i - 1;
			if (this.d) console.log(this);

			this.heapify(j);
		}

		// remove element and insert with updated priority
		update(e) {
			// is in the frontier already
			if (e.infrontier == 1) {
				this.arr[e.pos] = this.arr.pop();
				this.heapify(e.pos + 1);	
			}

			e.infrontier = 1;

			this.insert(e);
		}

		// Size of queue
		size() {
			return this.arr.length;
		}

		// insert at botttom and move up to right position 
		insert(e) {
			e.infrontier = 1;

			this.arr.push(e);
			let i = this.arr.length; // index
			this.arr[i - 1].pos = i - 1;

			while (i != 1) {
				let r = Math.floor(i / 2);

				if (cmp(this.arr[r - 1], this.arr[i - 1])) return; 

				let a = this.arr[i - 1];
				this.arr[i - 1] = this.arr[r - 1];
				this.arr[r - 1] = a;

				this.arr[r - 1].pos = r - 1;
				this.arr[i - 1].pos = i - 1;

				i = r;
			}
		}
	} // end class PQ

	// the priority queue to use
	let Pq = new PQ();

	let M = [];
	// init. grid to use as map
	for(let y = 0; y < H; y++) {
		let a = [];
		for(let x = 0; x < W; x++) {
			// from : previous node in least cost path
			// cost : cost of node so far
			// pos  : position in prior. queue 
			// infrontier: elem. in frontier
			// type : terrain type
			a.push({x: x, y: y, from: null, type: 0, cost: 1000000, pos: -1, infrontier: 0});
		}	
		M.push(a);
	}

	let draw = (x, y, s, c = 'black') => {
		wid.rows.item(y).cells.item(x).textContent = s;
		wid.rows.item(y).cells.item(x).className   = c;
	}

	// generate some obstacles
	for(let x = 0; x < 28; x++) {
		draw(x, 12, '#', 'red');
		M[12][x].type = 1; // terrain type 1
	}

	for(let x = 4; x < W; x++) {
		draw(x, 24, '#', 'red');
		M[24][x].type = 1; // terrain type 1
	}


	// start at 0, 0
	let m   = M[0][0];
	m.cost  = 0;

	Pq.insert(m);

	// check if value in range(a, b)

	// var. to use for custom timing 
	let s = 0;

	// offset of all four neighbours
	let nbs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

	function step() {
		// update every few frames
		if (s++ < 2) {
			window.requestAnimationFrame(step);
			return;
		}
		s = 0;

		// Done; no suitable nodes to explore
		if (!Pq.size()) 
			return;

		// pop lowest cost item
		let i = Pq.pop(); 


		// if goal reached
		if ((i.x == W - 1) && (i.y == H - 1)) {
			// this sets character in table element
			wid.rows.item(i.y).cells.item(i.x).textContent = `${i.cost}`;

			// stop anim.
			window.requestAnimationFrame(() => {});

			return;
		}

		// this updates the displayed grid using table cells
		draw(i.x, i.y, '♣');

		window.requestAnimationFrame(step);

		// rotate offsets to break ties in Pq of nodes with same priority 
		// makes grid look a bit better
		nbs = [nbs.pop(), ...nbs];

		for (let n of nbs) {
			let x0 = i.x + n[0];
			let y0 = i.y + n[1];

			// not within boundaries
			if (x0 < 0 || x0 >= W)
				continue

			if (y0 < 0 || y0 >= H)
				continue

			let e = M[y0][x0];

			// skip if terrain impassable
			if (e.type == 1) 
				continue;

			// check if found a cheaper path
			if (i.cost + 1 >= e.cost) 
				continue;

			// set new cost since a cheaper path was found
			e.cost = i.cost + 1;
			e.from = i;

			// insert or update
			Pq.update(e);
		}
	}

	window.requestAnimationFrame(step);
})();
