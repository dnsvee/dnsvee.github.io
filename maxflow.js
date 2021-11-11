
Graph = `
s A 10
s C 8
A B 5
A C 2
B t 7
C D 10
D B 8
D t 10
`;

let Flows = new Map();
let Nodes = new Map();

Graph.match(/\w \w \d+/g).forEach(m => {
	let [a, b, c] = m.match(/\w+/g);

	let s = Nodes.get(a) || new Set();

	s.add(b);
	Nodes.set(a, s);
	Flows.set(`${a} ${b}`, parseInt(c));
});

function print_flows() {
	for(let f of Flows.keys())
		console.log(`flow of ${f} is ${Flows.get(f)}`);
}

print_flows();

let Source = "s";
let Sink   = "t";

let step = 0;			

// will break when no more augmenting paths are found
while (true) {
	step += 1;
	console.log(`============== ${step} ============`);
	if (step == 10)
		break;

	// key is a node; value is previous node that reaches this node
	let M = new Map(); // temporary information

	// find shorthest path bread first
	try {
		let Q = [Source] // a queue
		let S = 0;
		while (true) {
			if (Q.length == 0)
				throw "ready";

			cur = Q.pop();
			nds = Nodes.get(cur);

			// get neighbours
			for(let id of nds.keys()) {
				if (M.get(id)) // visited already; can safely ignore cycles
					continue;

				if (id == Sink)  {
					M.set(Sink, cur); // set previous ro regain path taken
					throw "Sink found"
				}

				// flow and reverse flow
				let f = Flows.get(`${cur} ${id}`) || 0; 

				if (f) { // flow or residual flow
					Q.unshift(id);  // push in front of queue
					M.set(id, cur); // previous
				}
			}
		}
		// no augmenting paths found; so done
	} catch (exp) {
		if (exp == 'ready') {
			let total = 0;
			for(let f of Flows.keys()) {
				if (f.match(/t.+/)) 
					total -=  Flows.get(f);
			}
			console.log(`max flow is ${total}`);
			return;
		}

		// calc bottle neck
		let cur = Sink;
		let bottle = 9999;

		console.log('path found');
		do {
			console.log(cur);
			let prev = M.get(cur);
			let c = Flows.get(`${prev} ${cur}`);
			if (!c)
				break;
			bottle = Math.min(bottle, c);
			cur = prev;
		} while (true);

		console.log(`bottleneck is ${bottle}`);

		// augment
		cur = Sink;
		while (cur != Source) {
			let prev = M.get(cur);
			let f = Flows.get(`${prev} ${cur}`) || 0;
			let r = Flows.get(`${cur} ${prev}`) || 0;
			// is normal flow?
			if (f > 0) {
				if (f - bottle > 0) {
					Flows.set(`${prev} ${cur}`, f - bottle); // residual
				} else {
					Flows.delete(`${prev} ${cur}`);
				}

				Flows.set(`${cur} ${prev}`, r - bottle);
			} else {
				if (r + bottle < 0) {
					Flows.set(`${prev} ${cur}`, r + bottle);
				} else {
					Flows.delete(`${prev} ${cur}`);
				}

				Flows.set(`${cur} ${prev}`, f + bottle);
			}

			cur = prev;
		}

		print_flows();
	}

}
