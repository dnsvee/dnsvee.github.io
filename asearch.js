// Implementation of A* search algorithm
//
import { between, randint, shuffle } from './util.js'

(function sourcefile() {
	let wid = document.querySelector('#wrap');
	let bid = document.querySelector('#start');
	let id = document.querySelector('#source');
	
	// highlight source
	id.innerHTML = `<pre><code>${sourcefile.toString()}</code></pre>`;
	hljs.highlightAll();

	// when the start button is clicked when the grid is clicked a terrain element is added to the proper location
	start.onclick = () => {
		window.requestAnimationFrame(step);
		
		// build a grid that represents the map		
		for(let y = 0; y < H; y++) {
			for(let x = 0; x < W; x++) {
				let c = wid.rows.item(y).cells.item(x).textContent;
				if (y == 0 && x == 0) 
					continue

				if (y == H - 1 && x == W - 1) 
					continue

				// type == 1 if this cell contains a terrain element
				if (c == '#') {
					M[y][x].type = 1; 
				}
			}
		}
		start.textContent = 'Reload';
		start.onclick = () => {
			window.location.reload();
		};
	}

	// gets called when the mouse moves over the map; when a mouse button is held place a
	// # symbol in the cell at the right position	
	let placewall = (e) => {
		if (e.buttons == 0) 
			return;

		// check if clicked on a table cell		
		if (e.target.nodeName != "TD")
			return;

		e.target.textContent= '#';
		e.target.className  = 'red';
	};

	wid.addEventListener("mouseover", placewall,  true);

	// size of grid
	let W  = 20
	let H  = 20

	// use a table for the user to draw terrains elements into	
	let t = [];
	for(let y = 0; y < H; y++) {
		t.push('<tr>');
		for(let x = 0; x < W; x++) {
			t.push('<td>.</td>');
		}
		t.push('</tr>');
	}

	wid.innerHTML = t.join('');

	// the heuristic function used by the a* algo; calculates the cost of a path from start
	// to finish running to a certain cell by adding the cost from start to this cell
	// and a heuristic from this cell to the end	
	let heur = (i) => i.cost + Math.abs(W - 1 - i.x) +  Math.abs(H - 1 - i.y);

	// function used by the priority queue when comparing two cells by cost
	let cmp = (e0, e1) => {
		let h0 = heur(e0);
		let h1 = heur(e1);

		if (h0 == h1) {
			// tie breaker when heuristic is the same; maybe use randomness?
			let s0 = Math.sqrt(Math.pow(e0.x - W - 1, 2) + Math.pow(e0.y - H - 1, 2));
			let s1 = Math.sqrt(Math.pow(e1.x - W - 1, 2) + Math.pow(e1.y - H - 1, 2));
			return s0 < s1;
		}

		return h0 < h1;
	}

	// Priority Queue; orders cells from lowest to highest cost using the heuristic function
	class PQ {
		constructor() {
			this.arr = [];
		}

		// pop element with least cost
		pop() {
			if (this.arr.length == 0) 
				throw "Pq::pop: queue empty";

			let a = this.arr[0];

			// infrontier tracks if a cell is in the Priority Queue
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

		// move element down from root to the correct location
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

		// remove element and insert with updated priority/cost
		update(e) {
			// is it in the queue already?
			if (e.infrontier == 1) {
				// remove and reinsert later
				let a = this.arr.pop();
				a.pos = e.pos;
				this.arr[e.pos] = a;
				this.heapify(e.pos + 1);	
			}

			// the current cell is in the queue
			e.infrontier = 1;

			// insert or reinsert
			this.insert(e);
		}

		// Size of queue
		size() {
			return this.arr.length;
		}

		// insert cell at the bottom and move up into to right position 
		insert(e) {
			e.infrontier = 1;

			this.arr.push(e);

			// update the position of the cell in the queue			
			let i = this.arr.length; 
			this.arr[i - 1].pos = i - 1;

			// insert at the right spot 
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
	} // class priority queue

	// create an instance of the priority queue to use
	let Pq = new PQ();

	// the grid as a flat array
	// each index is a object storing per cell information
	// the cell location of the cell in this array is x * W + y where x, y are the coords
	// of the cell and W is the width of the grid
	let M = [];

	// initialize the grid with cells	
	for(let y = 0; y < H; y++) {
		let a = [];
		for(let x = 0; x < W; x++) {
			// from      : previous node in least cost path
			// cost      : cost of node so far
			// pos       : position in queue 
			// infrontier: is the element in the queue 1==yes, 0==no
			// type      : terrain type
			a.push({x: x, y: y, from: null, type: 0, cost: 1000000, pos: -1, infrontier: 0});
		}	
		M.push(a);
	}

	// draw char 's' at the pos x, y with color 'c'
	let draw = (x, y, s, c = 'black') => {
		wid.rows.item(y).cells.item(x).textContent = s;
		wid.rows.item(y).cells.item(x).style.color  = c;
	}

	// start is at top left; coordinates (0, 0)
	let m   = M[0][0];
	m.cost  = 0;

	// insert starting position in the queue
	Pq.insert(m);

	// offset of all four neighbours of a cell
	let nbs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

	// do something on each animation frame
	function step() {
		if (!Pq.size()) 
			// no suitable nodes left to explore
			return;

		// pop lowest cost item
		let i = Pq.pop(); 

		// if goal is reached
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

			// skip if the terrain impassable
			if (e.type == 1) 
				continue;

			// check if a cheaper path is found
			if (i.cost + 1 >= e.cost) 
				continue;

			// set the new cost since a cheaper path was found
			e.cost = i.cost + 1;
			e.from = i;

			// insert or update
			Pq.update(e);
		}
	}

})();
