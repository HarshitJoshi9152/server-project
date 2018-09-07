const fs = require('fs');
const path = require('path');

let dir = process.argv[3];

let misc = [];

function getFile(){
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Index Of</title>
        <link rel="stylesheet" href="C:\\backup\\Documents\\lenovo-PC\\node.js\\server-project\\versions\\style.css">
        <style>
        html, body{
            width:100%;
            margin:0px;
            padding:0px;
            height: 100%
        }
        body{
            background-color:whitesmoke;
            text-align: center;
            /* display: grid; */
            align-items: center;
            /* justify-content: center; */
            font-family: sans-serif;
            font-size:1.4vw;
            color:#272822;
        }
        a{
            text-decoration: none;
            font-weight: bold;
            color:greenyellow;
        }
        a:hover{
            color:red;
        }
        h1{
            font-size: 3em;
            color:#f33775;
            -webkit-margin-before: 0em;
            -webkit-margin-after: 0em;
        }
        *{
            -webkit-margin-before: 0em;
            -webkit-margin-after: 0em;
        }
        p{
            -webkit-margin-before: 1em;
            -webkit-margin-after: 1em;
        }
        ul{
            font-weight: bold;
            display:flex;
            /* position: absolute; */
            justify-content: space-evenly;
            /* top:0px;left:0px; */
            width:100%;
            list-style-type: none;
            -webkit-margin-before: 0.8em;
            -webkit-margin-after: 0.8em;
            -webkit-margin-start: auto;
            -webkit-margin-end: auto;
            -webkit-padding-start: 0px;
        }
        li{
            padding:5px;
            display:inline;
        }
        .table{
            display:grid;
            grid-template-columns:auto auto auto auto auto;
            /* border:2px dotted green; */
            padding:20px;
            background-color: #f33775;
            width:90%;
            margin: 4em auto;
            grid-gap: 50px 50px;
        }
        .file{
            display:inline-grid;
            /* border:2px dotted blueviolet; */
            /* width:200%; */
            font-size:2.6vw;
            background-color: rgba(45, 236, 236, 0.657);
        }
        .name{
            color:slateblue;
        }
        .dir > .size{
            color:slateblue;
            font-size:1vw !important;
        }
        </style>
    </head>
    <body>
        <header>
            <ul>
                <li><a href="javascript:void(0)">Like on GitHub &#9733;</a></li>
                <li><a href="javascript:void(0)">Donate</a></li>
                <li><a href="javascript:void(0)">Report a bug</a></li>
                <li><a href="javascript:void(0)">credits</a></li>
            </ul>
            <h1>server-project</h1>
            <p>please select the file to be served</p>
        </header>
        <div class="table">
        </div>
    </body>
    </html>`;
}

function traverse(dir = false){
    console.log("directory ",dir);
    fs.readdir(dir,"utf8",(err,FileList)=>{
        if(!err){
            for (const k of FileList) {
                if(fs.existsSync(path.join(dir,k))){
                    if(fs.lstatSync(path.join(dir,k)).isDirectory() == true){
                        console.log("DIR FOUND ",k);
                        console.log("path ",path.join(dir,k));
                        traverse(path.join(dir,k));
                    }
                    else{
                        console.log("file ",k);
                    }
                }
                else{
                    console.log("how is this possible that ",k," does not exist");
                    misc.push(k);
                }
            }
        }
        else{
            console.log(err);
        }
    })
}

if(dir){
    if(fs.existsSync(dir)){
        if(fs.lstatSync(dir).isDirectory() == true){
            // traverseNoRecursion(dir);
        }
        else{
            console.log("the input is not a valid directory");
            return -1;
        }
    }
    else{
        console.log("the directory does not exist");
        return -1;
    }
}
else{
    traverseNoRecursion(__dirname);
}



function traverseNoRecursion(dir){
    // Does not take relative path 
    if(fs.existsSync(dir)){
        if(fs.lstatSync(dir).isDirectory() == true){
            let obj = {
                directories:[],
                files:[]
            }
            let filesArray = fs.readdirSync(dir);
            // looping over all the files and directories
            for (const file of filesArray) {
                let relativePath = path.join(dir,file);
                try{
                let stats = fs.lstatSync(relativePath);
                if(stats.isBlockDevice()){
                    return `<h1 align="center">${relativePath}</h1>`;
                }
                if(stats.isDirectory() == true){
                    // it is a valid directory
                    obj.directories.push({
                        name:file,
                        size:fs.readdirSync(relativePath).length-1 
                    });
                }
                else if(stats.isFile() == true){
                    obj.files.push({
                        name:file,
                        size:stats.size
                    });
                }
                else{
                    // what could it be ? && what should i do now ?
                    // well i should do strict inspection
                    const report = {
                        relativePath,
                        "filestats":fs.lstatSync(relativePath)
                    };
                    debugger;
                }
            } catch (e){
                console.log(`access to ${file} is denied`);
                if(file == "hiberfil.sys"){
                    console.log("Hiberfil.sys is a system file that holds the hibernation data onto disk, you cannot just read it via normal rights, it's super confidential since it hold all memory information on disk.");
                };
                if(file == "Documents and Settings"){
                    console.log("i guess it acts like a pointer for security issues");
                };
            }
            }
            // when FOR loop is finished 
            return createPage(obj);
        
        }
        else{
            return {
                location:"traverseNoRecursion IF-2",
                message:"the argument is not a directory",
                code:503
            }
        }
    }
    else{
        return {
            location:"traverseNoRecursion IF-1",
            message:"No such file exists",
            code:401
        }
    }
}


function createPage(data){
    let template = '';
    if(!typeof data == 'object'){
        return {
            message:"1sty argument must be an object of 2 arrays",
            location:"createPage IF-1",
            code:201
        }
    }
    else{
        let HTML = getFile();
        // Loop over everything 
        for(const i in data){
            if(i == 'directories'){
                for(const d of data[i]){
                    // evaluating all directories 1 by 1.
                    template += `<div class="file"><span class="name">${d.name}</span><span class="size">${d.size} Files</span></div>`;
                }
            }
            else if(i == 'files'){
                for(const f of data[i]){
                    // evaluating all files 1 by 1.
                    template += `<div class="file"><span class="name">${f.name}</span><span class="size">${f.size} Bytes</span></div>`;
                }
            }
        }
        HTML = HTML.slice(0,HTML.indexOf("</div>")) + template + HTML.slice(HTML.indexOf("</div>"));
        return HTML;
    }
}

module.exports = {
    traverseNoRecursion,
    traverse,
    createPage,
    getFile
}