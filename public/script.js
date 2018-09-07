console.log('working');

function edit(elm,txt){
	if(typeof txt == 'string'){
	let e = document.createElement(elm);
	let t = document.createTextNode(txt);
	e.appendChild(t);
	document.body.appendChild(e);
	}
}