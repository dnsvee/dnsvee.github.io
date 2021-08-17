(function () {

	// sort functions
	let id = document.querySelector('#swapsort_source');
	id.innerHTML = '<pre>' + swapsort.toString() + '</pre>';
	id = document.querySelector('#quicksort_source');
	id.innerHTML = '<pre>' + qsort.toString() + '</pre>';
	id = document.querySelector('#mergesort_source');
	id.innerHTML = '<pre>' + merge.toString() + '\n\n' + mergesort.toString() + '</pre>';
	id = document.querySelector('#selectionsort_source');
	id.innerHTML = '<pre>' + selsort.toString() + '</pre>';
	id = document.querySelector('#insertionsort_source');
	id.innerHTML = '<pre>' + inssort.toString() + '</pre>';
	id = document.querySelector('#heapsort_source');
	id.innerHTML = '<pre>' + heapify.toString() + '\n\n' + makeheap.toString() + '\n\n' + heapsort.toString() + '</pre>';

	// check is array is sorted
	function issorted(a) {
		if (a.length <= 1) 
			return true;

		for(let i = 0; i < a.length - 1; i++) {
			if (a[i] > a[i + 1]) 
				return false;
		}

		return true;
	}

	// SELECTION SORT
	function selsort(arr) {
		// from idnex 0 to i array is sorted, other halve is unsorted
		for(let i = 0; i < arr.length; i++) {
			// m is the smallest number in the unsorted part of the array and n the index
			let m = arr[i]; 
			let n = i;

			// find the smallest element in the unsorted part
			for(let j = i + 1; j < arr.length; j++) {
				if (arr[j] < m) {
					m = arr[j]
					n = j;
				}
			}

			// put it at the tail of the sorted part of the array
			[arr[i], arr[n]] = [arr[n], arr[i]];
		}
		return arr;
	}

	// MERGE SORT
	 
	// merges two sorted arrays and returns it
	function merge(a, b) {
		let i = 0, j = 0;
		let c = [];

		// merge two arrays into one (both are sorted)
		while (i < a.length && j < b.length) {
			if (a[i] <= b[j]) {
				c.push(a[i]);
				i += 1;
			} else {
				c.push(b[j]);
				j += 1;
			}
		}

		// add elems left over from a
		if (i < a.length) 
			c.concat(a.splice(i));

		// add elems left over from b
		if (j < b.length) 
			c.concat(b.splice(j));

		return c;
	}

	// do the actual mergesort
	function mergesort(a) {
		// array of 0 or 1 elem. is sorted
		if (a.length <= 1) 
			return a;

		// split in two (almost) equal parts
		m = Math.floor(a.length / 2);

		let l = a.splice(0, m);

		// mergesort both parts and merge
		return merge(mergesort(l), mergesort(a));
	}

	// QUICKSORT
	function qsort(arr) {
		// array of 0 or 1 elem. is sorted
		if (arr.length <= 1) 
			return arr;

		let p = arr[0]; // pivot; should be more or less random
		let l = [];     // left
		let m = [];     // middle
		let r = [];     // right

		// divide array into three parts; smaller, equal to and larger than pivot
		for (const i of arr) {
			if (i === p) {
				m.push(i);
			} else if (i > p) {
				r.push(i);
			} else {
				l.push(i);
			}
		}

		// qsort smaller and larger parts and concat all three parts
		arr = []
		return qsort(l).concat(m).concat(qsort(r));
	}

	// SWAPSORT
	function swapsort(arr) {
		// array of 0 or 1 elem. is sorted
		if (arr.length <= 1) 
			return;

		// repeatedly swap two elems that are unordered
		// stop when after doing a scan over the array not a single swap was needed
		while (true) {
			let swapped = false;

			for(let i = 0; i < arr.length - 1; i++) {
				if (arr[i] > arr[i + 1]) {
					swapped = true;
					[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
				}
			}

			if (!swapped) 
				break;
		}
		return arr;
	}

	// INSERTION SORT
	function inssort(arr) {
		// array of 0 or 1 elem. is sorted
		if (arr.length <= 1) 
			return;

		let i = 0

		// divide array into two parts
		// part from 0 to index i is sorted
		// part from i + 1 to end of array is unsorted
		while (i < arr.length - 1) {
			// j is index of first elem of the part of the array that is still unsorted
			// swap it down into the sorted part until it is in the proper place
			let j = i + 1;

			while (arr[j - 1] > arr[j]) {
				[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
				j -= 1;
			}

			i += 1;
		}

		return arr;
	}

	// HEAP SORT
	//
	function heapify(arr, sz, i) {
		// heap starts from until sz
		// put element i (starting from 1; index is 0) in it's proper place in the heap
		// ensures that from element i down all children have lower priority 
		// swaps elements if needed
		let j   = i;
		
		if (i * 2     <= sz && arr[i * 2 - 1] > arr[i - 1])
			j   = i * 2;

		if (i * 2 + 1 <= sz && arr[i * 2    ] > arr[j - 1]) 
			j   = i * 2 + 1;

		if (i == j) 
			return

		let a       = arr[i - 1];
		arr[i - 1]  = arr[j - 1];
		arr[j - 1]  = a;

		// call heapify on the child that was swapped
		heapify(arr, sz, j);
	}

	function makeheap(arr) {
		// make a heap by calling heapify on all indices that are parents
		// ensures that all child nodes have lower priorities
		let m = Math.floor(arr.length / 2); 

		for(let i = m; i > 0; i--) {
			heapify(arr, arr.length, i);
		}
	}

	function heapsort(arr) {
		// the array to be sorted has two halves
		// the first halve is considered to be the heap
		// the remaining part is the tail of the sorted array
		//
		// on each step remove the largest value from the heap (at the top; the maximum value) and 
		// swap it with last node of the heap; decrease the size of the heap by 1; 
		// this value is now the head of the halve of the array that is sorted
		// call heapify on the root to fix the heap order
		//
		// on each step the heap size decreases by one and the value popped from the heap
		// is put in the correct index; the second halve of the array will grow by 1 on each 
		// loop; when no elements are left the array is fully sorted
		makeheap(arr);

		let a;
		for(let i = arr.length; i > 0; i--) {
			a          = arr[i - 1];
			arr[i - 1] = arr[0];
			arr[0]     = a;

			heapify(arr, i - 1, 1);
		}

		return arr;
	}

	// BUILTIN SORT
	function builtinsort(a) {
		a.sort((a,b) => a - b);
		return a;
	}

	// call function f with a as argument and time it; return a report string
	function reportone(f, n, a) {
		t0 = performance.now();
		a = f(a);
		t1 = performance.now();
		return `<tr><td id='td1'>${n}</td><td id='td2'>${(t1 - t0).toFixed(2)}ms</td></tr>`
	}


	// random nums
	let size = 10000;
	let arr  = new Array(size);
	arr = arr.fill(0).map(a => Math.floor(Math.random() * 1000000));

	document.querySelector('#perfh2').textContent = `Performance test (sorting ${size} elements)`;

	// test each algo with array of random nums and make a report
	reports = '<table><tr><th>Name</th><th>Time in ms</th></tr>';

	[[selsort, 'selection sort'], [swapsort, 'swapsort'], [inssort, 'insertion sort'], [qsort, 'quick sort'], [mergesort, 'merge sort'], [heapsort, 'heap sort'], [builtinsort, 'builtin sort']].forEach( ([fun, name]) => {
		reports += reportone(fun, name, Array.from(arr));
	});

	reports += '</table>'

	document.querySelector('#report').innerHTML = reports;
})();