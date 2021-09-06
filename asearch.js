// demonstration of A* search algorithm
//
import { between, randint, shuffle } from './util.js'

(function sourcefile() {
	let wid = document.querySelector('#wrap');
	let bid = document.querySelector('#start');

	let id = document.querySelector('#source');

	id.innerHTML = `<pre><code>${sourcefile.toString()}</code></pre>`;

	hljs.highlightAll();

	// add a unpassable terrain item when clicked on a cell
	// in the maze
	start.onclick = () => {
		window.requestAnimationFrame(step);
		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W; x++) {
				let c = wid.rows.item(y).cells.item(x).textContent;
				if (y == 0 && x == 0) 
					continue

				if (y == H - 1 && x == W - 1) 
					continue

				if (c == '#') {
					M[y][x].type = 1; // terrain type 1
				}
			}
		}
	}

	// draws a wall in the maze
	let placewall = (e) => {
		if (e.buttons == 0) 
			return;

		// check if target == table cell
		if (e.target.nodeName != "TD")
			return;

		e.target.textContent='#';
		e.target.className = 'red';
	};

	wid.addEventListener("mouseover", placewall,  true);

	// size of grid
	let W  = 20
	let H  = 20

	// start at 0, 0; find a path toward W, H

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
	// combines known cost and ia guestimate of cost to reach exit
	let heur = (i) => i.cost + Math.abs(W - 1 - i.x) +  Math.abs(H - 1 - i.y);

	// function used by priority queue when comparing
	// cells
	let cmp = (e0, e1) => {
		let h0 = heur(e0);
		let h1 = heur(e1);

		if (h0 == h1) {
			// tie breaker when heuristic is the same
			let s0 = Math.sqrt(Math.pow(e0.x - W - 1, 2) + Math.pow(e0.y - H - 1, 2));
			let s1 = Math.sqrt(Math.pow(e1.x - W - 1, 2) + Math.pow(e1.y - H - 1, 2));
			return s0 < s1;
		}

		return h0 < h1;
	}

	// priority queue
	class PQ {
		constructor() {
			this.arr = [];
		}

		// pop element with least priority
		pop() {
			if (this.arr.length == 0) 
				throw "Pq::pop: queue empty";

			let a = this.arr[0];

			// infrontier attr tracks if cells is in Priority Queue
			a.infrontier = 0;

			if (this.arr.length > 1) {
				this.arr[0] = this.arr.pop();
				this.arr[0].pos = 0;

				this.heapify(1);
			} else {
				a = this.arr.pop();
			}

			return a;
		}

		// move element down from root to correct location
		heapify(i) {
			let j = i;

			if (i * 2     <= this.arr.length && cmp(this.arr[i * 2 - 1], this.arr[i - 1]))
				j = i * 2;

			if (i * 2 + 1 <= this.arr.length && cmp(this.arr[i * 2    ], this.arr[j - 1]))
				j = i * 2 + 1;

			if (i == j) 
				return;

			let t = this.arr[j - 1];
			this.arr[j - 1] = this.arr[i - 1]
			this.arr[i - 1] = t;

			this.arr[j - 1].pos = j - 1;
			this.arr[i - 1].pos = i - 1;

			this.heapify(j);
		}

		// remove element and insert with updated priority
		update(e) {
			// is it in the queue already?
			if (e.infrontier == 1) {
				// remove and reinsert later
				let a = this.arr.pop();
				a.pos = e.pos;
				this.arr[e.pos] = a;
				this.heapify(e.pos + 1);	
			}

			// track that cell is in queue
			e.infrontier = 1;

			// insert or reinsert
			this.insert(e);
		}

		// Size of queue
		size() {
			return this.arr.length;
		}

		// insert at bottom and move up to right position 
		insert(e) {
			e.infrontier = 1;

			this.arr.push(e);

			// keep track of the position in the queue where the cell is 
			// inserted
			let i = this.arr.length; 
			this.arr[i - 1].pos = i - 1;

			// insert at the right spot and maintain queue invariants
			while (i != 1) {
				let r = Math.floor(i / 2);

				if (cmp(this.arr[r - 1], this.arr[i - 1])) 
					return; 

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

	// the maze
	let M = [];

	// init. the maze
	for(let y = 0; y < H; y++) {
		let a = [];
		for(let x = 0; x < W; x++) {
			// from : previous node in least cost path
			// cost : cost of node so far
			// pos  : position in queue 
			// infrontier: is the element in the queue
			// type : terrain type
			a.push({x: x, y: y, from: null, type: 0, cost: 1000000, pos: -1, infrontier: 0});
		}	
		M.push(a);
	}

	// draw char 's' at the pos x, y in the maze
	let draw = (x, y, s, c = 'black') => {
		wid.rows.item(y).cells.item(x).textContent = s;
		wid.rows.item(y).cells.item(x).style.color   = c;
	}

	// start at 0, 0
	let m   = M[0][0];
	m.cost  = 0;

	// insert starting position in the queue
	Pq.insert(m);


	// offset of all four neighbours
	let nbs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

	// do something on each animation frame
	function step() {
		if (!Pq.size()) 
			// no suitable nodes to explore
			return;

		// pop lowest cost item
		let i = Pq.pop(); 

		// if goal reached
		if ((i.x == W - 1) && (i.y == H - 1)) {
			// draw symbol at exit
			draw(i.x, i.y, '$', 'blue');

			// draw the best path from start to finish
			let y = H - 1;
			let x = W - 1;
			let e = M[y][x];
			while (e.from != null) {
				x = e.from.x;
				y = e.from.y;
				draw(x, y, 'X', 'darkgreen');
				e = e.from;
			}

			// done
			return;
		}

		// draw a symbol at current position
		draw(i.x, i.y, "@");

		window.requestAnimationFrame(step);

		// check neighbours of current cell and see
		// if they needed to be added to the queue
		for (let [n0, n1] of nbs) {
			let x0 = i.x + n0;
			let y0 = i.y + n1;

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

})();
