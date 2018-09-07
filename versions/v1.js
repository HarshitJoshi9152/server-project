// version 1;

/*
VERSION NOTES 
- featuring the amazing VScode http-server extension's traverse utility
- 
*/

// Requiring essential modules
const fs = require('fs'),
	http = require('http'),
	URL = require('url'),
	PATH = require('path');

const traverse = require("./traverseNoRecursionTest");

let userDIR = getARG("--dir");

if(userDIR){
    console.log("we need to server ",userDIR);
}

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

		// traverse route
		if(url == "/show"){
			res.writeHead(200, {"content-type":"text/html"});
			if(fs.existsSync(userDIR)){
				if(fs.lstatSync(userDIR)){
					// there is a BIG difference between using C: and C:/
					res.end(traverse.traverseNoRecursion(userDIR));
				}
				else{
					console.log("not a dir");
				}
			}	else{
				res.end("<h1 style=\"font-family:sans-serif\">No argv[3] or invalid argv[3]<h1>")
			}
		}

		// default favicon of server //
		else if (url == '/favicon.ico') {
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
				res.end("<h1 align=\"center\">File Not Present Or Deleted</h1>");
				console.log("FATAL-ERROR :: home page deleted");
			}
		// 	console.log("did not match any Path");
		// 	if(fs.existsSync(url.slice(1))){
		// 		console.log('absolute path');
		// 		if(fs.lstatSync(url).isDirectory()){
		// 			res.writeHead(200, {"content-type":"text/html"});
		// 			res.end(traverse.traverseNoRecursion(__dirname+url));
		// 		}
		// 		else{
		// 			// chances are it is already served but to be sure
		// 			// all the other things only serve from the public DIR (except the css col that has been altered temporarily)
		// 			// well we must restrict the access to files out of the ./public dir when programming for our website 
		// 			// but this is a project like the VS code Live-server extension so we sholud serve them all
		// 			// SO to SUM up we will get rid of this bekar block of code and globally allow serving all files 
		// 			//by removing the "./public" conjuction in joining path.
					
		// 			// DO NOT SERVE THE FILE #4:04 #9/3/18
		// 		}
		// 	}
		// 	else if(fs.existsSync(__dirname+url)){
		// 		let stats = fs.lstatSync(__dirname+url);
		// 		if(stats.isFile()){
		// 			// serve it well it must have been served earlier.
		// 		}
		// 		else if(stats.isDirectory()){
		// 			res.writeHead(200, {"content-type":"text/html"});
		// 			res.end(traverse.traverseNoRecursion(__dirname+url));
		// 		}
		// 		else{
		// 			return ;
		// 		}
		// 	}
		// 	else{
		// 		res.writeHead(404, {
		// 			'content-type': 'text/html'
		// 		});
		// 		res.end('<h1>404 file not found');
		// 		console.log('illegal ', req.method, ' request for', req.url);
		// 	}

		// }

		// //html
		// else if (url.match(/\.html$/)) {
		// 	if (fs.existsSync('./public' + path)) {
		// 		let htmlStream = fs.createReadStream('./public' + path);
		// 		res.writeHead(200, {
		// 			"content-type": "text/html"
		// 		});
		// 		htmlStream.on("error", (e) => {
		// 			console.log('read stream error while piping ', path, e);
		// 		})
		// 		let bytes = htmlStream.bytesRead.toString();
		// 		htmlStream.on('end', () => {
		// 			console.log(bytes, ' bytes of html ' + path + ' delivered')
		// 		});
		// 		htmlStream.pipe(res);
		// 	} else {
		// 		console.log("the requested file " + path + " does not exit");
		// 		notFound();
		// 	}
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

		//html :: version 0.7 supporting both relative and absolute paths {[underdevelopment,issue:automatic addition of C:// to the path variable]}
		else if (url.match(/\.html$/)) {
			if (fs.existsSync(path.slice(1))) {
				// for full file paths 
				let htmlStream = fs.createReadStream(path.slice(3));
				// .slice temporary solution for debugging purposes
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
			} 
			else if(fs.existsSync(__dirname+path)){
				// for relative paths
				let htmlStream = fs.createReadStream(__dirname + path);
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
			}
			else {
				console.log("the requested file " + path + " does not exit");
				notFound();
			}
		}

		// css
		else if (url.match(/\.css$/)) {
			if (fs.existsSync(PATH.join(__dirname, path))) {
				let cssStream = fs.createReadStream(PATH.join(__dirname, path));
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
			console.log("did not match any Path");
			if(fs.existsSync(url.slice(1))){
				console.log('absolute path');
				if(fs.lstatSync(url.slice(1)).isDirectory()){
					res.writeHead(200, {"content-type":"text/html"});
					let HTML = traverse.traverseNoRecursion(url.slice(1));
					if(HTML.location){
						console.log("\n",JSON.stringify(HTML));
						res.end(JSON.stringify(HTML));
					}
					else{
						res.end(HTML);
						console.log(`response for ${path} sent`)
					}
				}
				else{
					// chances are it is already served but to be sure
					// all the other things only serve from the public DIR (except the css col that has been altered temporarily)
					// well we must restrict the access to files out of the ./public dir when programming for our website 
					// but this is a project like the VS code Live-server extension so we sholud serve them all
					// SO to SUM up we will get rid of this bekar block of code and globally allow serving all files 
					//by removing the "./public" conjuction in joining path.
					// DO NOT SERVE THE FILE #4:04 #9/3/18
					console.log("this is unique case why didnt it get served before ?");
					debugger;
					// #4:27 #9/7/2018
					// getting here means we dont have present handler for this type of file.
				}
			}
			else if(fs.existsSync(__dirname+url)){
				let stats = fs.lstatSync(__dirname+url);
				if(stats.isFile()){
					// serve it well it must have been served earlier.
				}
				else if(stats.isDirectory()){
					res.writeHead(200, {"content-type":"text/html"});
					res.end(traverse.traverseNoRecursion(__dirname+url));
				}
				else{
					return ;
				}
			}
			else{
				res.writeHead(404, {
					'content-type': 'text/plain'
				});
				res.end('<h1>404 file not found');
				console.log('illegal ', req.method, ' request for', req.url);
			}
		}
	}
}).listen(8080);

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

function getARG(label){
    let index = 1 + process.argv.indexOf(label);
    if(index === 0){return undefined};
    return process.argv[index];
}
/* READ ME
only ment to serve files inside the public folder.(was) !important;
*/

/* log 4:20 9/7/2018 

	file serving is working (currently only supporting html css js jpeg)
	show route working.
	traverseNoRecursion(path) working.
	developed route to determine absolute and relative urls to handle requests better.
	problems-faced$:[
		"chrome banned the traverse utility ./style.css request !!",
		"C:// being added in the path variable being used in fs.createReadStreams when working with absolute paths !!"
	]
*/