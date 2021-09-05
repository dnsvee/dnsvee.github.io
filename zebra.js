// implements the solution to the Einstein/Zebra puzzle from Rosettacode
(function sourcefile() {
	// adds required properties (nationality, drinks, smokes, color of house, pet) for an Occupant object if they do not exist
	// in the 'occ' paramater 
	function occupant(occ) {
		for (i of ['nat', 'dri', 'smo', 'col', 'pet']) 
			if (!occ[i]) 
				occ[i] = '';
		return occ;
	}

	// Represents the five houses with some easily deduced information already added
	O = [occupant({nat: 'norwegian'}), occupant({col: 'blue'}), occupant({dri: 'milk'}), occupant({}), occupant({})];

	// every rule is represented with a function generator 
	// each rule tries every possible combination of possible answers while respecting
	// the info known up to this point 
	// If nothing works it fails letting the caller know it needs
	// to try a new route
	//
	function* rule2() {
		for (let i of [2, 3, 4]) {
			O[i].nat = 'english';
			O[i].col = 'red';
			S.push(rule3());
			yield;
			O[i].nat = '';
			O[i].col = '';
		}
		return;
	}

	function* rule3() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].nat === '') {
				O[i].nat = 'swedish';
				O[i].pet = 'dog';
				S.push(rule4());
				yield
				O[i].nat = '';
				O[i].pet = '';
			}

		}
		return
	}

	function* rule4() {
		for (let i in [0, 1, 2, 3, 4]) {
			if (O[i].nat === '' && O[i].dri === '') {
				O[i].nat = 'dane';
				O[i].dri = 'tea';
				S.push(rule6());
				yield
				O[i].nat = '';
				O[i].dri = '';
			}
		}
		return
	}

	function* rule6() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].dri === '' && O[i].col === '') {
				O[i].dri = 'coffee';
				O[i].col = 'green';
				S.push(rule7());
				yield;
				O[i].dri = '';
				O[i].col = '';
			}
		}
		return
	}

	function* rule7() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].pet === '' && O[i].smo === '') {
				O[i].pet = 'birds';
				O[i].smo = 'pallmall';
				S.push(rule8());
				yield;
				O[i].pet = '';
				O[i].smo = '';
			}
		}
		return;
	}

	function* rule8() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].col === '' && O[i].smo === '') {
				O[i].col = 'yellow';
				O[i].smo = 'dunhill';
				S.push(rule13());
				yield;
				O[i].col = '';
				O[i].smo = '';
			}
		}
		return;
	}

	function* rule13() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].dri === '' && O[i].smo === '') {
				O[i].dri = 'beer';
				O[i].smo = 'bluemaster';
				S.push(rule14());
				yield;
				O[i].dri = '';
				O[i].smo = '';
			}
		}
		return;
	}

	function* rule14() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].nat === '' && O[i].smo === '') {
				O[i].nat = 'german';
				O[i].smo = 'price';
				S.push(rule5());
				yield;
				O[i].nat = '';
				O[i].smo = '';
			}
		}
		return;
	}

	function* rule5() {
		for (let i of [0, 1, 2, 3]) {
			if (O[i].col === 'green') {
				if (O[i + 1].col === '') {
					O[i + 1].col = 'white';
					S.push(rule12());
					yield;
					O[i + 1].col = '';
				}
			}
		}
		return;
	}

	function* rule12() {
		for (let i of [0, 1, 2, 3]) {
			if (O[i].smo === 'dunhill') {
				if (i > 0 && O[i - 1].pet === '') {
					O[i - 1].pet = 'horse';
					S.push(lastrule());
					yield;
					O[i - 1].pet = ''
				} 
				if (i < 4 && O[i + 1].pet === '') {
					O[i + 1].pet = 'horse';
					S.push(lastrule());
					yield;
					O[i + 1].pet = ''
				} 
			}
		}
		return;
	}

	function* lastrule() {
		for (let i of [0, 1, 2, 3]) {
			if (O[i].smo === '' && O[i + 1].dri === '') {
				O[i].smo     = 'blend';
				O[i + 1].dri = 'water';
				S.push(lastrule2());
				yield;
				O[i].smo     = '';
				O[i + 1].dri = '';
			}

			if (O[i].dri === '' && O[i + 1].smo === '') {
				O[i].dri     = 'water';
				O[i + 1].smo = 'blend';
				S.push(lastrule2());
				yield;
				O[i].dri     = '';
				O[i + 1].smo = '';
			}
		}
		return;
	}

	function* lastrule2() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (O[i].smo === 'blend') {
				if (i > 0) {
					if (O[i - 1].pet === '') {
						O[i - 1].pet = 'cats';
						S.push(findzebra());
						yield;
						O[i - 1].pet = '';
					}
				}
				if (i < 4) {
					if (O[i + 1].pet === '') {
						O[i + 1].pet = 'cats';
						S.push(findzebra());
						yield;
						O[i + 1].pet = '';
					}
				}
			}
		}
		return;
	}

	// which owner pet has not been identified
	// that is the zebra owner
	function* findzebra() {
		for (let i of [0, 1, 2, 3, 4]) {
			if (!O[i].pet) {
				document.querySelector('#table1').rows.item(i + 1).cells.item(3).textContent = 'ZEBRA';
				throw "Done";
			}
		}
	}

	// this is a stack of generator functions representing the state of the solver
	let S = [rule2()];

	// output table
	let text  = '<tr> <th>===</th><th>Nationality</th> <th>Drinks</th> <th>Smokes</th> <th>Pet</th> <th>Color</th> </tr>';
	for(let i = 0; i < 5; i++) 
		text += '<tr> <td>_________</td><td></td> <td></td> <td></td> <td></td> <td></td> </tr>';

	document.querySelector('#table1').innerHTML = text;

	// passed to requestAnimationFrame
	var step = () => {
		let r;

		try {
			// calls rule on top of stack to generate next attempt at
			// solving the puzzle
			// when a rule generates a new possible state of the puzzle 
			// it calls another rule function
			// if a generator fails it backtracks into a previous
			// known valid state
			r = S[S.length - 1].next();
		} catch (err) {
			// done
			return;
		}

		window.requestAnimationFrame(step);

		// the generator function cannot find any more possible solutions
		// it's popped from the stack and the previous generator becomes i
		// top of the stack
		if (r.done) 
			S.pop();

		// output known info.
		let tid = document.querySelector('#table1');

		for (let i = 0; i < 5; i++) {
			let o = O[i];
			let c = tid.rows.item(i + 1).cells;
			c.item(1).textContent = o.nat;
			c.item(2).textContent = o.dri;
			c.item(3).textContent = o.smo;
			c.item(4).textContent = o.pet;
			c.item(5).textContent = o.col;
		}
	}
	// start
	//
	let id = document.querySelector('#source');
	id.innerHTML = `<pre><code>${sourcefile.toString()}</code></pre>`;

	hljs.highlightAll();

	window.requestAnimationFrame(step);
})();

