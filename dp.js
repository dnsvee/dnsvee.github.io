// implements the following algorithms using dynamic programming
// Coin Change
// Longest Common Subsequence
// Knapsack 1/0 problem
// Edit distance
//
import { shuffle } from './util.js'

(function () {
	// Knapsack Problem

	function knapsack(Is, MaxWeight) {
		// Array containg the 2D array 
		// x-axis: weight in units of 1
		// y-axis  item no.
		let M = [];

		//  max weight 0 means cant pick any item
		for(let i = 0; i <= Is.length; i++) {
			M[i * 1024] = 0;
		}

		// if no item was picked the max weight is 0
		for(let i = 0; i <= MaxWeight; i++) {
			M[i] = 0;
		}

		// fill in the array iteravily for each item and for each step of weight calulate
		for(let i = 1; i <= Is.length; i++) {
			for(let j = 1; j <= MaxWeight; j++) {
				// current item
				let it = Is[i - 1];

				// prevent out of bound
				M[i * 1024 + j] = Math.max(M[(i - 1) * 1024 + j], (it.weight <= j) ? it.value + M[(i - 1) * 1024 + j - it.weight] : 0);
			}
		}

		// Retrieve the solution working from the back
		let w  = MaxWeight;
		let i  = Is.length;

		let Result = new Set();

		while (i != 0) {
			let it = Is[i - 1];
			
			if (M[i * 1024 + w] == it.value + M[(i - 1) * 1024 + w - it.weight]) {
				Result.add(i - 1);
				w   = w - Is[i - 1].weight;
			} 
			i -= 1;
		}

		return [Result, M[Is.length * 1024 + MaxWeight]];
	}

	// test knapsack 
	function knapsack_test() {
		// this data is from RosettaCode
		let Is = [
			{name: 'map',                weight:   9, value: 150},
			{name: 'compass',            weight:  13, value:  35},
			{name: 'water',              weight: 153, value: 200},
			{name: 'sandwich',           weight:  50, value: 160},
			{name: 'glucose',            weight:  15, value:  60},
			{name: 'tin',                weight:  68, value:  45},
			{name: 'banana',             weight:  27, value:  60},
			{name: 'apple',              weight:  39, value:  40},
			{name: 'cheese',             weight:  23, value:  30},
			{name: 'beer',               weight:  52, value:  10},
			{name: 'suntan',             weight:  11, value:  70},
			{name: 'camera',             weight:  32, value:  30},
			{name: 'tshirt',             weight:  24, value:  15},
			{name: 'trousers',           weight:  48, value:  10},
			{name: 'umbrella',           weight:  73, value:  40},
			{name: 'waterprooftrousers', weight:  42, value:  70},
			{name: 'waterproofclothes',  weight:  43, value:  75},
			{name: 'notecase',           weight:  22, value:  80},
			{name: 'sunglasses',         weight:   7, value:  20},
			{name: 'towel',              weight:  18, value:  12},
			{name: 'socks',              weight:   4, value:  50},
			{name: 'things',             weight:  30, value:  10}
		]

		let [R, Value] = knapsack(Is, 400);

		let out = ['<table>'];
		let ws  = 0; // total weight of final choice

		out.push('<tr><td>name</td><td>weight</td><td>value</td><td>picked value</td></tr>');
		for(let i = 0; i < Is.length; i++) {
			let n0 = Is[i].name;
			let v0 = Is[i].value;
			let w0 = Is[i].weight;

			let s = '';

			// if item picked in final choice at the value to the 'picked' column of the final table
			if (R.has(i)) {
				s   = `${v0}`;
				ws += w0;
			} 

			out.push(`<tr><td>${n0}</td><td>${w0}</td><td>${v0}</td><td>${s}</td></tr>`);

		}
		out.push(`<tr><td></td><td>${ws}</td><td></td><td>${Value}</td></tr>`);
		out.push(['</table>']);	

		document.querySelector('#ksout').innerHTML = out.join('');
	}



	// Edit Distance
	
	// edit distance between 2 strings
	function editdistance(a, b) {
		let M = [];

		let W = a.length + 1;
		for(let j = 0; j <= b.length; j++) {
			for(let i = 0; i <= a.length; i++) {
				if        (i === 0) {
					M[j * W] = j;
				} else if (j === 0) {
					M[i    ] = i;
				} else {
					let v = (a[i - 1] === b[j - 1]) ? 0 : 1;

					M[j * W + i] = Math.min( 
						v + M[(j - 1) * W + i - 1],
						1 + M[ j      * W + i - 1],
						1 + M[(j - 1) * W + i    ]);
				};
			};
		};
		return M[b.length * W + a.length];
	}

	// test editdistance 
	function editdistance_tests() {
		let ed = document.querySelector('#editdist');

		let out = '';

		for (let t of [['sitting', 'kitten'], ['intention', 'execution'], ['CCGATGATCATTGCCAGTCCACTTGTGAGAACGACAGCGACTCCAGC', 'CCGATGACTTTTGCAGCTCCACTTTTGGTCCAGC']]) {
			let [a, b] = t;
			out += `<p>Edit distance between ${a} and ${b} is ${editdistance(a, b)}</p>`;
		}
		ed.innerHTML = out;
	}



	// Coin Change 
	function coinchange(denoms, value) {
		let M      = [] 

		M[0] = 0;

		for(let v = 1; v <= value; v++) {
			M[v] = 1 << 16;
			for (let d of denoms) {
				if (v - d >= 0) 
					M[v] = Math.min(M[v - d] + 1, M[v]);
			};
		}

		let v = value;
		let a = M[value];

		let Result = []
		while (v > 0) {
			for(let d of denoms) {
				if (M[v - d] == a - 1) {
					Result.push(d);
					a = a - 1;
					v = v - d;
				}
			};
		}
		return [Result, M[value]];
	};

	// tests the coinchange function
	function coinchange_tests() {
		let denoms   = [1, 2, 3, 5, 10, 20, 50, 100];
		let value    = 197;
		let [R, tot] = coinchange(denoms, value);

		let o = '';
		o    += `<p>Using coin denominations (${denoms.join(', ')}) these coins (${R.join(", ")}) makes for a total value of ${value}`;
		document.querySelector('#coinchange').innerHTML = o;
	}



	// longest common subsequence
	
	// longest common subsequence of two strings a & b
	let longcomm =  function(a, b) {
		let M = []

		let W = a.length + 1;

		for(let j = 0; j <= b.length; j++) {
			for(let i = 0; i <= a.length; i++) {
				if (i == 0 || j == 0) {
					M[j * W + i]  = 0;
					continue;
				}

				let v = 0;
				if (a[i - 1] === b[j - 1]) {
					v = M[j * W + i] = 1 + M[(j - 1) * W + i - 1];
				}

				M[j * W + i] = 
					Math.max(v, M[(j - 1) * W + i], M[j * W + i - 1]);
			}
		}

		// make a graphic to illustrate how the lcs is shared between a and b
		let y = b.length;
		let x = a.length;

		let b0 = [], a0 = [];

		let s = [];
		while (x > 0 || y > 0) {
			let m0 = M[(y - 1) * W + x    ];
			let m1 = M[ y      * W + x - 1];
			let m2 = M[ y      * W + x    ];

			let mx = Math.max(m0, m1, m2);

			if (mx == m0) {
				y--;
				b0.push("*");
				a0.push(" ");
			} else if (mx == m1) {
				x--;
				a0.push("*");
				b0.push(" ");
			} else {
				if (a[x - 1] == b[y - 1]) {
					s .push(a[x - 1]);
					b0.push(b[y - 1]);
					a0.push(a[x - 1]);
				} else {
					b0.push('*');
					a0.push('*');
				}

				y--;
				x--;
			}
		}

		return [a0.reverse().join(''), b0.reverse().join(''), s.reverse().join('')];
	};

	// test longcomm
	function longcomm_tests() {
		let a = 'CCGATGATCATTGCCAGTCCACTTGTGAGAACGACAGCGACTCCAGC';
		let b = 'CCGATGACTTTTGCAGCTCCACTTTTGGTCCAGC';

		let [a0, b0, s] = longcomm(a, b);

		let lcs  = document.querySelector('#lcs');

		lcs.innerHTML  = `<p>longest common sequence of </p>`
		lcs.innerHTML += `<p>${a}</p>`
		lcs.innerHTML += `<p>and</p>`
		lcs.innerHTML += `<p>${b}</p>`
		lcs.innerHTML += `<p>is</p>`
		lcs.innerHTML += `<p>${s}</p>`
		lcs.innerHTML += `<p>Next two strings illustrate how the two strings share the lcs. A star means letter deleted; a space is used to align the lcs.`;
		lcs.innerHTML += `<pre>${a0}</pre>`;
		lcs.innerHTML += `<pre>${b0}<pre>`;
	}

	// call the tests
	coinchange_tests();

	editdistance_tests();

	knapsack_test();

	longcomm_tests();
})();
