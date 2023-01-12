var longText = localStorage.getItem("StorageData");

var dataUri = "data:text/plain;base64," + btoa(longText);

document.getElementById("statusText").onclick = function(){
    document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)
}

document.getElementById("fileUpload").onsubmit = function(event){
    event.preventDefault()
    if(localStorage.getItem("StorageData") == null){
        localStorage.setItem("StorageData") = event
    } else {
    }
}