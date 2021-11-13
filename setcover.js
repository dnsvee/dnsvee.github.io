(function () {
	// set cover problem solved by Algorithm X
	document.querySelector("#source").innerHTML = `<pre><code class="language-javascript">${maxflow.toString()}</code></pre>`
	hljs.highlightAll();

	// from wikipedia
	// each row is a set
	// a 1 in each column means the element represented by this column is in the (row) set
	let P = [ [1, 0, 0, 1, 0, 0, 1],  //A
		[1, 0, 0, 1, 0, 0, 0],  //B
		[0, 0, 0, 1, 1, 0, 1],  //C
		[0, 0, 1, 0, 1, 1, 0],  //D
		[0, 1, 1, 0, 0, 1, 1],  //E
		[0, 1, 0, 0, 0, 0, 1]]; //F

	// All rows numbers
	let Rs = new Set([0, 1, 2, 3, 4, 5]);

	// All column numbers
	let Cs = new Set([0, 1, 2, 3, 4, 5, 6]);

	// The final result if any; all columns are represented in each row only once 
	let Path = [];

	// R and C are the only rows and columns that need to be considered
	function step(R, C) {
		// all columns included; a solution has been found
		if (C.size == 0) 
			throw Path;
		
		// no rows left to cover remaining columns; dead end
		if (R.size == 0) 
			return;

		// TODO: implement least 1s in a column
		for(let c of C) {
			for(let r of R) {
				// skip rows that dont cover column
				if (P[r][c] != 1) 
					break;

				// pick one row
				// check all columns where the selected row has a 1
				// remove all rows that have a 1 in each of the columns
				//
				// visrows and viscols are sets that contain the only rows and columns
				// that remaing to be matched in the next step
				let visrows = new Set(R);
				let viscols = new Set(C);

				for(let c of C) {
					// for all columns with a 1 in the picked row
					if (P[r][c] == 1) {
						// find all rows with a 1 in the same column
						for(let r0 of R) {
							if (P[r0][c] == 1) {
								viscols.delete(c);
								visrows.delete(r0);
							}
						}
					}
				}

				// try the next step with the remaining colums and rows
				// add store t tentatively in
				Path.push(r);
				step(visrows, viscols);
				Path.pop();

			}

		}
	}

	// start here
	step(Rs, Cs);
})();


