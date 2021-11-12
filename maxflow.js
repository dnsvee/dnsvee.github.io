// implements the maximum flow in a network graph algorithm using edmonds karp
(function maxflow() {
	// setup syntax highlighting and add source code
	document.querySelector("#source").innerHTML = `<pre><code class="language-javascript">${maxflow.toString()}</code></pre>`
	hljs.highlightAll();
	console.log('highlighted');

	// the graph from  ...
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


	let out = [];

	// Flows is a map of edges and flow; Flows.get("A B") == 5
	let Flows = new Map();

	// Nodes is a map where key is a node and value is set of nodes that can be
	// potentially reached; Nodes["s"] == ["A", "B"]
	let Nodes = new Map();

	// Convert string of Graph and populate Nodes and Flows
	Graph.match(/\w \w \d+/g).forEach(m => {
		let [a, b, c] = m.match(/\w+/g);

		let s = Nodes.get(a) || new Set();

		s.add(b);
		Nodes.set(a, s);
		Flows.set(`${a} ${b}`, parseInt(c));
	});

	function print_flows() {
		for(let f of Flows.keys())
			out.push(`flow of ${f} is ${Flows.get(f)}`);
	}

	// source and sink of network graph
	let Source = "s";
	let Sink   = "t";

	// Loops over all possible augmenting paths in network flow
	 
	// Will end when no more augmenting paths are found
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
			do {
				out.push(`cur`);
				let prev = M.get(cur);
				if (!prev)
					break;

				let c = Flows.get(`${prev} ${cur}`);

				bottle = Math.min(bottle, c);
				cur = prev;
			} while (true);

			out.push(`bottleneck is ${bottle}`);

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
})();
