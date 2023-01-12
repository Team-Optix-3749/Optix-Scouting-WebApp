var longText = localStorage.getItem("StorageData");

var dataUri = "data:text/plain;base64," + btoa(longText);

// document.getElementById("statusText").onclick = function(){
    document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)
// }

document.getElementById("fileUpload").onsubmit = async function(event){
    event.preventDefault()
    var fileInput = document.getElementById("upload");
    var file = fileInput.files[0];
    var content = JSON.parse(await file.text())
    console.log(content)
    if(localStorage.getItem("StorageData") == null){
        localStorage.setItem("StorageData", JSON.stringify(content))
    } else {
        var existingStorage = JSON.parse(localStorage.getItem("StorageData"))

        if(!Array.isArray(content)){
            existingStorage.push(JSON.parse(content))
        } else{
            content.forEach((c) =>{
            console.log(c)
            existingStorage.push(c)
            })
        }
        localStorage.setItem("StorageData", JSON.stringify(existingStorage))
    }
}