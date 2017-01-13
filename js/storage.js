function setData(name, value){
	localStorage.setItem(name, value);
}

function getData(name){
	return localStorage.getItem(name);
}

function eraseData(name){
	localStorage.removeItem(name);
}
