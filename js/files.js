var longText = localStorage.getItem("StorageData");

var dataUri = "data:text/plain;base64," + btoa(longText);

document.getElementById("statusText").onclick = function(){
    document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)
}