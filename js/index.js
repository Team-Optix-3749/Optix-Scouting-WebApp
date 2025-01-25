

var scannedText = ''
var scanned = false
var teamNum = 0
var matchNum = 0

function resetScanner () {
    scannedText = ""
    scanned = false
    document.getElementById("savedIndicator").style.display = "none"
    document.getElementById("statusText").innerHTML = "Status: Not Scanned"
}

document.getElementById("scanNext").onclick = resetScanner

document.getElementById("save").onclick = () => {
    storeScannedData(scannedText)
    document.getElementById("savedIndicator").style.display = "inline-block"
    document.getElementById("scanNext").disabled = false
}

document.getElementById("cancel").onclick = () => {
    resetScanner()
    document.getElementById("scanNext").disabled = false
}


function storeScannedData(scannedText) {
    
    if(scannedText == undefined) return;

    const storageKey = 'StorageData'

    var newStorage = ''

    console.log("saving", scannedText)

    var existingStorage = JSON.parse(localStorage.getItem(storageKey))
    if (existingStorage == null) existingStorage = []
    var parseText = JSON.parse(scannedText)
    parseText.teamNumber = document.getElementById("teamNum").valueAsNumber
    parseText.matchNumber = document.getElementById("matchNum").valueAsNumber
    var key = parseText.comp.toString() + parseText.teamNumber.toString() + parseText.matchNumber.toString()
    existingStorage = existingStorage.filter(element =>{
        var key2 = element.comp.toString() + element.teamNumber.toString() + element.matchNumber.toString()
        if(key == key2){
            return false
        } else return true
    })
    existingStorage.push(parseText)
    newStorage = JSON.stringify(existingStorage)
    localStorage.setItem(storageKey, newStorage)
}

function updateDropdown(devices){
    select = document.getElementById("cameras")
    devices.forEach(element => {
        option = document.createElement("option")
        option.innerHTML = element.label
        select.appendChild(option)
    });
}

Html5Qrcode.getCameras().then(devices => {
    updateDropdown(devices)
})

function getCamera(label){
    return Html5Qrcode.getCameras().then(devices => {
        return devices.find(element => {
            if(element.label.toString() == label.toString()){
                return true
            }
            return false
        });
    })
}

function qrCodeSuccessCallback (decodedText, decodedResult){
    if (scanned) return
    scanned = true

    document.getElementById("statusText").innerHTML = "Status: Scanned"
    document.getElementById("scanNext").disabled = true

    if (decodedText!= null){
        scannedText = decodedText
        var data = JSON.parse(scannedText)
        document.getElementById("teamNum").value = data.teamNumber
        document.getElementById("matchNum").value = data.matchNumber
    }
}

document.getElementById("startScanning").onclick = async () => {
    l = document.getElementById("cameras")
    label = l.options[l.selectedIndex].text
    const html5QrCode = new Html5Qrcode("reader", verbose=false);
    var cameraId = (await getCamera(label)).id
    options =
    {
        fps: 10,
        qrbox: {height:250, width:250}
    }
    html5QrCode.start(cameraId, options, qrCodeSuccessCallback)
}

function findLinks(events){
    var links = 0
    var test = 0

    events.forEach(event => {
        event.forEach(e => {
            test += e > 0 ? 1 : 0
            if (e == 0) test = 0
            if (test == 3){
                links += 1
                test = 0
            }
        }) 
    });
    return links
}