function sendGetRequest() {
	const xhp = new XMLHttpRequest();
	xhp.open("GET", "./data.csv", true);
	xhp.onload = ({ target }) => {
		if (target.status === 200) {
			displayDocument(target.responseText);
		}
	};
	xhp.send(null);
}

function sendPostRequest(text) {
	const xhp = new XMLHttpRequest();
	xhp.open("PATCH", "../data.csv", true);
	xhp.onload = ({ target }) => {
		console.log(target.status, "<<<target.status");
		if (target.status === 200) {
			displayDocument(target.responseText);
		} else if (target.status === 405) {
			console.log("not allowed");
		}
	};
	xhp.send(text);
}

function responseHandler(...args) {
	console.log(args);
}

function displayDocument(text) {
	document.getElementById("file-seat").innerText = text;
	document.getElementById("controls-seat").innerHTML =
		"<button onClick='sendGetRequest()'>View File</button><button onClick='editFile()'>Edit File</button>";
}

function editFile() {
	document.getElementById("file-seat").innerHTML =
		"<textarea id='text-area' cols=80>" +
		document.getElementById("file-seat").innerText +
		"</textarea>";
	document.getElementById("controls-seat").innerHTML =
		"<button onClick='saveFile()'>Save File</button>";
}

function saveFile() {
	sendPostRequest(document.getElementById("text-area").value);
	document.getElementById("controls-seat").innerHTML =
		"<button onClick='sendGetRequest()'>View File</button>";
	document.getElementById("file-seat").innerText = "";
}
