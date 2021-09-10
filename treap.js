chance = new Chance();

// A Treap data structure; stores key values pairs in a balanced binary tree
class Treap {
	constructor() {
		this.root = null;
		this.sz   = 0; // size of treap
	}

	// makes a node for internal use
	// k0: key
	// v0: value
	makenode(k0, v0) {
		// l0, r0: left and right node
		// p: priority
		return {l : null, k : k0, v : v0, r : null, p : Math.random()}
	}

	// makes right node of n the new root and n becomes the left child of the new root; adjust child nodes accordingly
	// returns new root
	rotateleft(n) {
		let t = n.r;
		n.r   = n.r.l;
		t.l   = n;
		return t;

	}

	// makes left node of n the new root and n becomes the right child of the new root; adjust child nodes accordingly
	// returns new root
	rotateright(n) {
		let t = n.l;
		n.l   = n.l.r;
		t.r = n;
		return t;
	}

	// called by insert(n)
	// inserts key k0 with value v0 
	// this function can modify the structure of the tree with root 'n' so it will the return the new root if changed or the old
	// root if not
	insert_(k0, v0, n) {
		// element already exists
		if (k0 == n.k) 
			return n;

		// key to the left of root
		if (k0 < n.k) {
			if (n.l == null) {
				// can insert as leaf
				n.l = this.makenode(k0, v0);
				this.sz++;
			} else {
				// insert in left subtree
				n.l = this.insert_(k0, v0, n.l);
			}

			// fix heap priority order
			if (n.l.p > n.p) {
				return this.rotateright(n);
			}

			// root not changed
			return n;
		} 

		// same for right side
		if (k0 > n.k) {
			if (n.r == null) {
				n.r = this.makenode(k0, v0);
				this.sz++;
			} else {
				n.r = this.insert_(k0, v0, n.r);

			}

			if (n.r.p > n.p) {
				return this.rotateleft(n);
			}
			return n;
		}

		// should never be reached
		throw new Error("Treap::insert: invalid state");
	}

	// inserts key/value pair in treap
	// key must be non-null and unique 
	insert(k0, v0) {
		if (k0 == null) 
			throw new Error("Treap::insert: cannot insert null as key");

		if (this.root == null) {
			this.sz = 1;
			this.root = this.makenode(k0, v0);
			return;
		}

		this.root = this.insert_(k0, v0, this.root);
	}

	// creates a treap froom argument 'c' if it supports a for-of loop
	from(c) {
		for(let [k, v] of c) 
			this.insert(k, v);
	}

	// used by find
	find_(k, n) {
		if (n == null)
			return null;

		if (n.k == k) 
			return n;

		if (k < n.k) 
			return this.find_(k, n.l);

		if (k > n.k) 
			return this.find_(k, n.r);
	}

	// returns the value associated with k
	find(k) {
		if (this.sz == 0)
			return null;

		let r = this.find_(k, this.root);

		return r ? r.v : null;
	}

	// returns true if k exists
	exists(k) {
		return this.find_(k) != null;
	}

	// removes k from the treap at root n
	// this method can change the root so it will return the possible new root
	remove_(k, n) {
		if (n.k == k) {
			if (n.l == null && n.r == null) {
				// is leaf node so remove
				this.sz--;
				return null;
			}

			if (n.l == null) {
				// if left child is null just overwrite the node to be replaced with treap with root n.r
				this.sz--;
				return n.r;
			}

			if (n.r == null) {
				// if right child is null just overwrite the node to be replaced with treap with root n.l
				this.sz--;
				return n.l;
			}

			// removing nodes means subtree must potentially be reordered to restore heap invariant
			// and means having to readjust treap ordering by rotations
			if (n.l.p > n.r.p) {
				n = this.rotateright(n);
				n.r = this.remove_(k, n.r);
				return n;
			} else {
				n = this.rotateleft(n);
				n.l = this.remove_(k, n.l);
				return n;
			}
		}

		// node not found so try one of the subtrees
		if (k < n.k) {
			n.l = this.remove_(k, n.l);
			return n;
		}

		if (n.k < k) 
			n.r = this.remove_(k, n.r);

		// returns root of subtree originally at node n
		return n;
	}

	// remove node with key k; returns true if element removed
	remove(k) {
		let i = this.sz;
		this.root = this.remove_(k, this.root);
		return this.sz == i;
	}

	// update k with new value v
	update(k, v) {
		let n = this.find_(k, this.root)
		if (n != null)
			n.v = v;
	}

	// iterates in the correct ordering over all the nodes
	each_(f, n, i) {
		if (n.l != null)
			this.each_(f, n.l, i);

		f(n.k, n.v, i + 1);

		if (n.r != null)
			this.each_(f, n.r, i + 1);
	}

	// calls f for each node in the correct order
	each(f) {
		if (this.root == null)
			return

		this.each_(f, this.root, 0);
	}

	// returns size
	size() {
		return this.sz;
	}

	// retuns treap as string
	// eg.: {one: 1, two: 2}
	// or if value is null or undefined
	// eg.: {1, 2, 3}
	toString() {
		let res = [];
		this.each((k, v) => {
			if (v)
				res.push(`${k}: ${v}`)
			else
				res.push(`${k}`)
		});
		return ['{', ...res.join(', '), '}'].join('');
	}

	// remove all nodes
	clear() {
		this.root = null;
		this.sz   = 0;
	}

	depth_(n, d) {
		let d0 = d, d1 = d;
		if (n.l != null)
			d0 = this.depth_(n.l, d + 1);

		if (n.r != null)
			d1 = this.depth_(n.r, d + 1);

		return Math.max(d0, d1);
	}

	depth() {
		if (this.root == null)
			return 0;

		return this.depth_(this.root, 1);
	}
}

function assert(r, e, m) {
	if (r == e)
		return;

	throw new Error(`expected ${e}; found ${r}`);
}


let id = document.querySelector('#tests');
// create a treap
try {
	let t = new Treap();

	// populate treap with 100000 elements
	let names  = chance.unique(chance.name, 10000);
	let cities = chance.unique(chance.city, 10000);
	let n = names[0];
	let c = cities[0];

	while (names.length) 
		t.insert(names.pop(), cities.pop());

	assert(t.size(), 10000, "size() != 10000");

	// find and update a mode
	let f = t.find(n);
	t.update(n, "amsterdam");
	f = t.find(n);
	assert(f, "amsterdam", "f != amsterdam");

	t.clear()	

	// insert and remove some nodes
	t.insert(0);
	t.insert(1);
	t.insert(2);
	t.insert(3);
	t.insert(4);
	
	assert(t.size(), 5);

	assert(t.toString(), "{0, 1, 2, 3, 4}")

	let test = (i)=> {
		assert(t.find(i), undefined);
		t.remove(i);
		t.find(i);
	}

	test(2);
	test(3);
	test(0);
	test(1);
	test(4);

	assert(t.size(), 0);

} catch (err) {
	id.innerHTML = err;
} finally {
	id.innerHTML = 'All tests passed';
}

document.querySelector('#source').innerHTML = `<pre><code>${Treap.toString()}</code></pre>`;
hljs.highlightAll();

// use a tble to display
//
