(function() {

	chance.bool();
	let men   = new Map();
	let women = new Map();

	men.set('abe',    ['abi',  'eve',  'cath', 'ivy',  'jan',  'dee',  'fay',  'bea',  'hope', 'gay'])
	men.set('col',    ['hope', 'eve',  'abi',  'dee',  'bea',  'fay',  'ivy',  'gay',  'cath', 'jan'])
	men.set('ed',     ['jan',  'dee',  'bea',  'cath', 'fay',  'eve',  'abi',  'ivy',  'hope', 'gay'])
	men.set('fred',   ['bea',  'abi',  'dee',  'gay',  'eve',  'ivy',  'cath', 'jan',  'hope', 'fay'])
	men.set('bob',    ['cath', 'hope', 'abi',  'dee',  'eve',  'fay',  'bea',  'jan',  'ivy',  'gay'])
	men.set('gav',    ['gay',  'eve',  'ivy',  'bea',  'cath', 'abi',  'dee',  'hope', 'jan',  'fay'])
	men.set('hal',    ['abi',  'eve',  'hope', 'fay',  'ivy',  'cath', 'jan',  'bea',  'gay',  'dee'])
	men.set('ian',    ['hope', 'cath', 'dee',  'gay',  'bea',  'abi',  'fay',  'ivy',  'jan',  'eve'])
	men.set('dan',    ['ivy',  'fay',  'dee',  'gay',  'hope', 'eve',  'jan',  'bea',  'cath', 'abi'])
	men.set('jon',    ['abi',  'fay',  'jan',  'gay',  'eve',  'bea',  'dee',  'cath', 'ivy',  'hope'])

	women.set('eve',  ['jon',  'hal',  'fred', 'dan',  'abe',  'gav',  'col',  'ed',   'ian',  'bob'])
	women.set('abi',  ['bob',  'fred', 'jon',  'gav',  'ian',  'abe',  'dan',  'ed',   'col',  'hal'])
	women.set('fay',  ['bob',  'abe',  'ed',   'ian',  'jon',  'dan',  'fred', 'gav',  'col',  'hal'])
	women.set('gay',  ['jon',  'gav',  'hal',  'fred', 'bob',  'abe',  'col',  'ed',   'dan',  'ian'])
	women.set('cath', ['fred', 'bob',  'ed',   'gav',  'hal',  'col',  'ian',  'abe',  'dan',  'jon'])
	women.set('hope', ['gav',  'jon',  'bob',  'abe',  'ian',  'dan',  'hal',  'ed',   'col',  'fred'])
	women.set('ivy',  ['ian',  'col',  'hal',  'gav',  'fred', 'bob',  'abe',  'ed',   'jon',  'dan'])
	women.set('jan',  ['ed',   'hal',  'gav',  'abe',  'bob',  'jon',  'col',  'ian',  'fred', 'dan'])
	women.set('dee',  ['fred', 'jon',  'col',  'abe',  'ian',  'hal',  'gav',  'dan',  'bob',  'ed'])
	women.set('bea',  ['bob',  'abe',  'col',  'fred', 'gav',  'dan',  'ian',  'ed',   'jon',  'hal'])

	for (let g of [men, women]) {
		for (let a of g) {
			let [n, p] = a;
			g.set(n, { engagedto: '', prefs: chance.shuffle(p) } );
			//g.set(n, { engagedto: '', prefs: p.reverse() } );
		}
	}

	let count = 0;

	let stack = [];

	let log = [];
	let id = document.querySelector("#output");
	
	let data = document.querySelector("#data");

	let r = []
	X = men;
	for(let X of [men, women]) {
	for (let m of X) {
		let [k, v] = m;
		r.push(`<p>${k} ranking: ${v.prefs.toString()}</p>`);
	}
	}
	data.innerHTML += r.join('');

	let step = () => {
		// stop when everybody engaged
		if (count == 10) {
			let f = document.querySelector("#final");
			for (let [k, v] of men) {
				if (v.engagedto) {
					f.innerHTML += `<p>${k} engaged to ${v.engagedto}</p>`;
				}
			}
			return;
		}

		if (stack.length == 0) {
			for (let m of men) {
				let [k, v] = m;
				if (v.engagedto != '') 
					continue;

				stack.push(m);
			}
		}

		let [k, v] = stack.pop();
		// if man engaged skip

		// propose to woman most preferred not yet proposed too
		let name_of_woman = v.prefs.pop(); 

		// get the woman indicate by name_of_woman
		let awoman = women.get(name_of_woman);

		// if woman not yet engaged
		if (!awoman.engagedto) {
			id.innerHTML += `<p>engage ${k} and ${name_of_woman}</p>`;
			// engage provisionally to proposing man
			awoman.engagedto = k;
			v.engagedto      = name_of_woman;

			count++;
		} else {
			// if engaged check if the preference is for the man
			// who proposes or the man she is engaged to
			if (awoman.prefs.indexOf(k) > awoman.prefs.indexOf(awoman.engagedto)) {
				// woman prefers proposing men
				let man = men.get(awoman.engagedto);
				man.engagedto = ''; // break engagement
				id.innerHTML += `<p>break engagement of ${awoman.engagedto} and ${name_of_woman}</p>`;

				// make new engagement
				awoman.engagedto = k;
				v.engagedto = name_of_woman;
				id.innerHTML += `<p>engage ${k} and ${name_of_woman}`;
			}
		}

		// list all engagements
		window.requestAnimationFrame(step);
	};
	window.requestAnimationFrame(step);

})();






