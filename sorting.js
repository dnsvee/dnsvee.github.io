(function () {
	// get the source code for each of the sorting function
	let id = document.querySelector('#swapsort_source');
	id.innerHTML = '<pre><code>' + swapsort.toString() + '</code></pre>';
	id = document.querySelector('#quicksort_source');
	id.innerHTML = '<pre><code>' + qsort.toString() + '</code></pre>';
	id = document.querySelector('#mergesort_source');
	id.innerHTML = '<pre><code>' + merge.toString() + '\n\n' + mergesort.toString() + '</code></pre>';
	id = document.querySelector('#selectionsort_source');
	id.innerHTML = '<pre><code>' + selsort.toString() + '</code></pre>';
	id = document.querySelector('#insertionsort_source');
	id.innerHTML = '<pre><code>' + inssort.toString() + '</code></pre>';
	id = document.querySelector('#heapsort_source');
	id.innerHTML = '<pre><code>' + heapify.toString() + '\n\n' + makeheap.toString() + '\n\n' + heapsort.toString() + '</code></pre>';

	hljs.highlightAll();

	// return true if a is a sorted array	
	function issorted(a) {
		if (a.length <= 1) 
			return true;

		for(let i = 0; i < a.length - 1; i++) {
			if (a[i] > a[i + 1]) 
				return false;
		}

		return true;
	}

	// Selection sort	
	function selsort(arr) {
		// select the smallest element from the unsorted part of the array and place it into
		// it's proper location (smallest element first, second smallest second etc.)
		// keep doing this until the array is sorted
		
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

	// Merge sort	 	
	
	// merge two sorted arrays
	function merge(a, b) {
		let i = 0, j = 0;
		let c = [];

		while (i < a.length && j < b.length) {
			if (a[i] <= b[j]) {
				c.push(a[i]);
				i += 1;
			} else {
				c.push(b[j]);
				j += 1;
			}
		}

		// add elements left over from a
		if (i < a.length) 
			c.concat(a.splice(i));

		// add elements left over from b
		if (j < b.length) 
			c.concat(b.splice(j));

		return c;
	}

	// merge sort
	// recursively split an array into two halves until you are left with one element
	// arrays; these are sorted since the only containt one element
	// in the next step merge each two adjacent sorted arrays into a larger sorted array
	function mergesort(a) {
		// array of length 0 or 1 means the array is sorted
		if (a.length <= 1) 
			return a;

		// split in two (almost) equal parts
		m = Math.floor(a.length / 2);

		let l = a.splice(0, m);

		// mergesort both parts and merge
		return merge(mergesort(l), mergesort(a));
	}

	// Quicksort	
	function qsort(arr) {
		// array of length 0 or 1 means the array is sorted		
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

	// Swapsort
	function swapsort(arr) {
		// array of 0 or 1 length means the array is sorted		
		if (arr.length <= 1) 
			return;

		// repeatedly swap two elements that are unordered
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

	// Insertion sort
	function inssort(arr) {
		// array of 0 or 1 length means the array is sorted				
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

	// Heap sort	

	// creates a heap in array '??rr' with length sz from index i 
	function heapify(arr, sz, i) {
		// ensure the the array at index i is a binary heap
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
		let m = Math.floor(arr.length / 2); 

		for(let i = m; i > 0; i--) {
			heapify(arr, arr.length, i);
		}
	}

	function heapsort(arr) {
		// turn array in a heap
		makeheap(arr);

		// repeatedly swap maximum value from heap into proper location at the end of the
		// array
		let a;
		for(let i = arr.length; i > 0; i--) {
			a          = arr[i - 1];
			arr[i - 1] = arr[0];
			arr[0]     = a;

			// fix heap property of heap after swap			
			heapify(arr, i - 1, 1);
		}

		return arr;
	}

	// Builtin sort
	function builtinsort(a) {
		a.sort((a,b) => a - b);
		return a;
	}

	// Call function f with a as argument and time it; return a report string
	function reportone(f, n, a) {
		t0 = performance.now();
		a = f(a);
		t1 = performance.now();
		return `<tr><td id='td1'>${n}</td><td id='td2'>${(t1 - t0).toFixed(2)}ms</td></tr>`
	}


	// Generate random numbers
	let size = 1000;
	let arr  = new Array(size);
	arr = arr.fill(0).map(a => Math.floor(Math.random() * 1000000));

	document.querySelector('#perfh2').textContent = `Performance test (sorting ${size} elements)`;

	// Test each sorting algorithm by sorting the random numbers of array	
	reports = '<table><tr><th>Name</th><th>Time in ms</th></tr>';

	[[selsort, 'selection sort'], [swapsort, 'swapsort'], [inssort, 'insertion sort'], [qsort, 'quick sort'], [mergesort, 'merge sort'], [heapsort, 'heap sort'], [builtinsort, 'builtin sort']].forEach( ([fun, name]) => {
		reports += reportone(fun, name, Array.from(arr));
	});

	reports += '</table>'

	document.querySelector('#report').innerHTML = reports;
})();
