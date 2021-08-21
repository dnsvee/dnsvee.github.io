class Treap {
	constructor() {
		this.root = null;
		this.sz   = 0;
	}

	insert_(k0, v0, n) {
		if (k0 == n.k) {
			return;
		}

		if (k0 < n.k) {
			if (n.l == null) {
				n.l = {l : null, k : k0, v : v0, r : null, p : Math.random()}
				if (n.l.p > n.p) {
				}
			} else {
				n = insert(k0, v0, n.l);
			}
		}

		if (k0 > n.k) {
			if (n.r == null) {
				n.r = {l : null, k : k0, v : v0, r : null, p : Math.random()}
				if (n.r.p > n.p) {
				}
			} else {
				insert(k0, v0, n.r);
			}
		}

		throw "Treap Exception: should never happen";
	}

	insert(k0, v0) {
		if (root == null) {
			this.sz = 1;
			root = {l : null, k : k0, v : v0, r : null, p : Math.random()}
			return;
		}

		insert(k0, v0, root);
	}

	find(k) {
	}

	remove(k) {
	}

	update(k, v) {
	}

	each(f) {
	}

	check() {
	}

	size() {
	}

	toString_(n) {
		if (n == null) {
			return ['null'];
		}

		return [...this.toString_(n.l), `, ${k} : ${v}, `, ...this.toString_(n.r)]
	}

	toString() {
		let r = ['(']
		r = r.concat(this.toString_(null))
		r.push(')')
		return r.join('')
	}
}


let t = new Treap();

let r = console.log(t.toString());
