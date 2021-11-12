(function () {
	// from wikipedia
	//
	let P = [ [1, 0, 0, 1, 0, 0, 1],  //A
		[1, 0, 0, 1, 0, 0, 0],  //B
		[0, 0, 0, 1, 1, 0, 1],  //C
		[0, 0, 1, 0, 1, 1, 0],  //D
		[0, 1, 1, 0, 0, 1, 1],  //E
		[0, 1, 0, 0, 0, 0, 1]]; //F

	let Rs = new Set([0, 1, 2, 3, 4, 5]);
	let Cs = new Set([0, 1, 2, 3, 4, 5, 6]);
	let Path = [];

	// looks like it works
	function step(R, C) {
		if (C.size == 0) {
			throw Path;
		}

		if (R.size == 0) {
			return;
		}

		console.log(R, C);

		// find column with least 1s
		for(let c of C) {
			let cols = [];
			for(let r of R) {
				if (P[r][c] != 1) 
					break;

				console.log(`pick row ${r}`);
				// pick one row
				//
				// check all columns where the selected row has a 1
				//
				// remove all rows that have a 1 in each of the columns
				let visrows = new Set(R);
				let viscols = new Set(C);

				for(let c of C) {
					if (P[r][c] == 1) {
						// find all rows with a 1
						for(let r0 of R) {
							if (P[r0][c] == 1) {
								viscols.delete(c);
								visrows.delete(r0);
							}
						}
					}
				}

				Path.push(r);
				step(visrows, viscols);
				Path.pop();

			}

		}
	}

	step(Rs, Cs);

})();


