// version 0.2;

// Requiring essential modules
const fs = require('fs'),
	http = require('http'),
	URL = require('url');



// establishing the server
http.createServer((req, res, err) => {
	if (err) {
		console.log('fatal error ::: ', err);
		return err;
	} else {
		console.log(`${req.method} request for ${req.url}`);
		// declaring variables
		let url = req.url; //well path==url but we have overused them now
		let path = URL.parse(url).pathname;
		// SETTING UP ROUTES

		// default favicon of server //
		if (url == '/favicon.ico') {
			if (fs.existsSync('./public' + path)) {
				// {"content-type","icon/favicon"} downloaded the jpeg
				fs.readFile('./public' + path, function (err, data) {
					if (!err) {
						res.writeHead(200, {
							"content-type": "image/x-icon"
						});
						res.end(data);
						console.log(' favicon [' + path + '] delivered')
						// success with image/x-icon;
					} else {
						console.log("error", err);
					}
				})
			} else {
				console.log('no favicon by default');
			}
		}

		// homepage
		else if (url == '/') {
			if (fs.existsSync('./public' + path)) {
				res.writeHead(200, {
					"content-type": "text/html"
				});
				let home = fs.createReadStream('./public/index.html');
				home.on('end', () => {
					let bytes = home.bytesRead.toString();
					console.log(bytes, ' bytes of html [' + path + '] delivered');
				});
				home.on("error", (e) => {
					console.log('read stream error while piping ', path, e);
				})
				home.pipe(res);
			} else {
				res.writeHead(200, {
					"content-type": "text/html"
				});
				res.end("<h1>File Not Present Or Deleted</h1>");
				console.log("FATAL-ERROR :: home page deleted");
			}
		}

		//html
		else if (url.match(/\.html$/)) {
			if (fs.existsSync('./public' + path)) {
				let htmlStream = fs.createReadStream('./public' + path);
				res.writeHead(200, {
					"content-type": "text/html"
				});
				htmlStream.on("error", (e) => {
					console.log('read stream error while piping ', path, e);
				})
				let bytes = htmlStream.bytesRead.toString();
				htmlStream.on('end', () => {
					console.log(bytes, ' bytes of html ' + path + ' delivered')
				});
				htmlStream.pipe(res);
			} else {
				console.log("the requested file " + path + " does not exit");
				notFound();
			}
		}

		// image/jpg
		else if (url.match(/.jpg$/)) {
			if (fs.existsSync('./public' + path)) {
				let ImageStream = fs.createReadStream("./public" + path);
				res.writeHead(200, {
					"content-type": "image/jpeg"
				});
				ImageStream.pipe(res);
				ImageStream.on('end', () => {
					let bytes = ImageStream.bytesRead.toString();
					console.log(bytes + ' bytes of jpg [' + path + '] delivered');
				})
				ImageStream.on("error", (e) => {
					console.log('read stream error while piping ', path, e);
				})
			} else {
				console.log("the requested file " + path + " does not exit");
				notFound();
			}
		}

		// css
		else if (url.match(/\.css$/)) {
			if (fs.existsSync('./public' + path)) {
				let cssStream = fs.createReadStream('./public' + path);
				res.writeHead(200, {
					"content-type": "text/css"
				});
				cssStream.pipe(res);
				cssStream.on('end', () => {
					let bytes = cssStream.bytesRead.toString();
					console.log(bytes, ' bytes of stylesheet [' + path + '] delivered');
				})
				cssStream.on('error', (e) => {
					console.log('read stream error while piping ', path, e);
				})
			} else {
				notFound();
				console.log("the requested file " + path + " does not exit");
			}
		}

		// script
		else if (url.match(/\.js$/)) {
			if (fs.existsSync('./public' + path)) {
				let ScriptStream = fs.createReadStream('./public' + path);
				res.writeHead(200, {
					"content-type": "text/script"
				});
				ScriptStream.pipe(res);
				ScriptStream.on('end', () => {
					let bytes = ScriptStream.bytesRead.toString();
					console.log(bytes, ' bytes of script [' + path + '] delivered');
				})
				ScriptStream.on('error', (e) => {
					console.log("read stream error while piping ", path, e);
				})
			} else {
				console.log("the requested file " + path + " does not exit");
				notFound();
			}
		}

		// 404 not found
		else {
			res.writeHead(404, {
				'content-type': 'text/plain'
			});
			res.end('404 file not found');
			console.log('illegal ', req.method, ' request for', req.url);
		}
	}
}).listen(1614);

console.log('\nserver started on port 1614 !!\n')

/*
OBSERVATIONS :
1. THE BROWSER RQUESTS FOR THE FAVICON EACH TIME A USER CHANGES A TAB.
2. firefox takes a lot of time while transfering html. {invalid}
3. the loading speed is significantly slower with syncronous operations.
4. content-type:"icon/favicon" downloads the image however "image/x-icon" displays the favicon.
*/
// notes: 21:37 the firefox problem seems to be fixed somehow;
// notes: fs.readFile abjured due to drawbacks.
/*
 COMPLETED PROJECT 05-08-2018 16:56 HARSHIT JOSHI
 we still need to ::::
 1. make it available globaly, currently its utility is only limited to the files relative to the ./public folder.
 2. introduce error handling. <DONE>
 3. verify if files exist before serving them, we can't trust the user blindly. <DONE>
*/
function notFound() {
	return "res.writeHead(404 ,{'content-type':'text/plain'});" +
		"res.end('404 file not found');";
}

/* READ ME
only ment to serve files inside the public folder.
*/