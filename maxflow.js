// implements the edmonds-karp algorithm for finding the maximum flow in a network graph 
// in a graph with vertices and edges; imagine an edge is a waterpipe that allows a maximum flow throughput
// this is the total capacity of the edge; pick one vertice as the source and another as the sink
// max flow of a graph is the sum of the flow into the sink graph respecting the max capacity
// of each edge
//
(function maxflow() {
	// setup syntax highlighting and add source code
	document.querySelector("#source").innerHTML = `<pre><code class="language-javascript">${maxflow.toString()}</code></pre>`;
	hljs.highlightAll();

	// a graph; syntax is source dest maxcapacity
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

	// output string
	let out = [];

	// Flows maps edges to flows; key = 's A', value = 10
	let Flows = new Map();

	// Nodes maps node to list of node reachable by edge
	// key = "A", value = ["B", "C"]
	let Nodes = new Map();

	// Convert string of Graph and populate Nodes and Flows
	Graph.match(/\w \w \d+/g).forEach(m => {
		let [a, b, c] = m.match(/\w+/g);

		let s = Nodes.get(a) || new Set();

		s.add(b);
		Nodes.set(a, s);
		Flows.set(`${a} ${b}`, parseInt(c));
	});

	// textual display of flows in graph
	function print_flows() {
		for(let f of Flows.keys())
			out.push(`Flow of ${f} is ${Flows.get(f)}`);
	}

	// source and sink of network graph
	let Source = "s";
	let Sink   = "t";

	// Loops over all possible augmenting paths in network flow
	//
	out.push('The starting graph is');
	print_flows();
	console.log('');
	 
	// Loop over all augmening paths
	while (true) {
		// key is a node; value is previous node that reaches this node on a augmenting path
		let M = new Map();

		try {
			// try find shorthest path bread first
			let Q = [Source] // a queue
			let S = 0;
			while (true) {
				// cant find a path anymore
				if (Q.length == 0)
					throw "ready";

				cur = Q.pop();
				nds = Nodes.get(cur);

				// get neighbours of node on possible path
				for(let id of nds.keys()) {
					if (M.get(id)) // visited already
						continue;

					if (id == Sink)  {
						// found a path
						M.set(Sink, cur); 
						throw "Sink found"
					}

					// find possible flow
					let f = Flows.get(`${cur} ${id}`) || 0; 

					if (f) { // flow or residual flow found; so path possible
						Q.unshift(id);  
						M.set(id, cur); 
					}
				}
			}
		} catch (exp) {
			if (exp == 'ready') {
				// done; caclulate total flow into sink
				let total = 0;
				for(let f of Flows.keys()) {
					if (f.match(/t.+/)) 
						total -=  Flows.get(f);
				}

				out.push(`max flow is ${total}`);
				document.querySelector("#output").innerHTML = `<pre> ${out.join('\n')} </pre>`;
				return;
			}

			// calc bottle neck of found path
			let cur = Sink;
			let bottle = 9999;

			out.push('')
			out.push('augmenting path found:');
			let path = []
			do {
				path.unshift(`${cur}`);
				let prev = M.get(cur);
				if (!prev)
					break;

				let c = Flows.get(`${prev} ${cur}`);

				bottle = Math.min(bottle, c);
				cur = prev;
			} while (true);

			out.push(path.join(' '));
			out.push(`bottleneck is ${bottle}`);

			// augment; remove edges if flow is 0
			// add residual edges with negative values if needed
			cur = Sink;
			while (cur != Source) {
				let prev = M.get(cur);
				let f = Flows.get(`${prev} ${cur}`) || 0;
				let r = Flows.get(`${cur} ${prev}`) || 0;
				if (f > 0) {
					// normal flow
					if (f - bottle > 0) {
						Flows.set(`${prev} ${cur}`, f - bottle); // residual
					} else {
						Flows.delete(`${prev} ${cur}`);
					}

					Flows.set(`${cur} ${prev}`, r - bottle);
				} else {
					// residual flow
					if (r + bottle < 0) {
						Flows.set(`${prev} ${cur}`, r + bottle);
					} else {
						Flows.delete(`${prev} ${cur}`);
					}

					Flows.set(`${cur} ${prev}`, f + bottle);
				}

				cur = prev;
			}
 
			// print updated flow
			console.log('');
			print_flows();
		}

	}
})();
