(function galeshapely() {
	// implements the gale-shapely algorithm
	let X = 30;

	// output table
	let T = ['<table id="table1">'];
	 T.push('<thead><tr><th>Hospital</th><th>Student</th></tr></thead>');
	for(let i = 0; i < X; i++) {
		T.push('<tr><td></td><td></td></tr>');
	}
	T.push('</table>');
	document.querySelector("#output").innerHTML = T.join('');
	
	// displays this function
	let s = galeshapely.toString();
	s = s.replace('<', '&lt;');
	s = s.replace('>', '&gt;');
	document.querySelector("#source").innerHTML = `<pre><code class="language-javascript">${s}</code></pre>`
	hljs.highlightAll();

	// generate a bunch of city names and personal names
	let H0 = chance.unique(chance.state, X, {full: true});
	let S0 = chance.unique(chance.name, X);

	// each hospital is represented as
	// H['hospital name'] = { id: numerical_id, partner: 'name of matched partner', prefs: [list students in order of preference] }
	let c = (A, P, M) => {
		for (let i = 0; i < X; i++) {
			let a = A[i];
			let p = chance.shuffle([...P]);
			M.set(a, { id: i, partner: '', prefs: p } );
		}
		return M;
	}

	H = c(H0, S0, new Map());
	S = c(S0, H0, new Map());

	// fill in names of hospitals in first column
	let id = document.querySelector("#table1");
	for(let [k, v] of H) 
		id.rows.item(v.id + 1).cells.item(0).textContent = k;

	let count = 0; // amount of succesfull matchings
	let stack = [];
	let log = [];

	// so the algorithm goes as follows:
	// on each step every hospital that is not matched with a student proposes to a student that it has not already
	// proposed too 
	// if the student is not matched already then it will always accept the proposal
	//
	// if the student is already matched with a hospital the student will compare the preference it has for the hospital whom
	// it is matched with and the hospital that is currently proposing to the student
	//
	// if the preference for the latter is greater then it will unmatch from the hospital
	// it is currently matched with and will match with the proposing hospital
	//
	// keep doing this until a situation arises where
	// no pair of unmatched hospital and student will exist where both prefer each other above the partner they are 
	// currently matched with
	//
	let step = () => {
		// stop when everybody engaged
		if (count == X) {

			return;
		}

		// stack is array of all hospitals that will need to propose
		if (stack.length == 0) {
			for (let h of H) {
				let [k, v] = h;
				if (v.partner != '') 
					continue;

				stack.push(h);
			}
		}

		let [k, v] = stack.pop();

		// propose to student most preferred but not yet proposed too
		let name_of_student = v.prefs.pop(); 

		// get the student
		let astudent = S.get(name_of_student);

		// if student isnt matched yet
		if (astudent.partner == '') {
			id.rows.item(v.id + 1).cells.item(1).textContent = name_of_student;
			
			astudent.partner = k;
			v.partner = name_of_student;

			count++;
		} else {
			// if engaged check if the preference is for the hospital currently matched too
			// or the proposing hospital
			if (astudent.prefs.indexOf(k) > astudent.prefs.indexOf(astudent.partner)) {
				// student prefers proposing hospital
				let h = H.get(astudent.partner);

				h.partner = ''; // unmatch

				// make new matching
				astudent.partner = k;
				v.partner = name_of_student;
				id.rows.item(v.id + 1).cells.item(1).textContent = name_of_student;
			}
		}

		window.requestAnimationFrame(step);
	};
	window.requestAnimationFrame(step);

})();






