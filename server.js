// server for running code examples
//
const http = require('http')
const Url  = require('url')
const fs   = require('fs')

async function listener(req, resp) {
	const { method } = req;
	let url  = new Url.parse(req.url)
	let file = url.pathname;
	console.log('request.url: ' + req.url);
	file = file.substr(1);
	if (file.length === 0) {
		file = 'index.html';
	}
	try {
		ctype = 'text/plain'
		var txt;
		if (file.endsWith('html')) {
			ctype = 'text/html';
			txt = fs.readFileSync( file, 'utf-8' );
		} else if (file.endsWith('css')) {
			ctype = 'text/css';
			txt = fs.readFileSync( file, 'utf-8' );
		} else if (file.endsWith('js')) {
			ctype = 'text/javascript';
			txt = fs.readFileSync( file, 'utf-8' );
		} else if (file.endsWith('ico')) {
			ctype = 'image/x-icon';
			txt = fs.readFileSync( file, null );
		}
		resp.writeHead(200, {'Content-Type' : ctype});
		resp.end(txt);
		return;
	} catch (error) {
		console.log(error);
		resp.writeHead(404, {'Content-Type' : 'text/html'});
		resp.end('404');
	}
};

console.log('server started');
http.createServer( listener ).listen(7000);

