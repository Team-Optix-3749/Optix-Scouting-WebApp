if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

function resetScanner () {
    scannedText = ""
    scanned = false
    document.getElementById("statusText").innerHTML = "Status: Not Scanned"
}

document.getElementById("scanNext").onclick = resetScanner

document.getElementById("save").onclick = () => {
    storeScannedData(scannedText)
    document.getElementById("scanNext").disabled = false
}

document.getElementById("cancel").onclick = () => {
    resetScanner()
    document.getElementById("scanNext").disabled = false
}

// testing data storage and usage
var scannedText = ''
var scanned = false

function storeScannedData(scannedText) {
    
    if(scannedText == undefined) return;

    const storageKey = 'StorageData'

    var newStorage = ''

    console.log("saving", scannedText)

    var existingStorage = JSON.parse(localStorage.getItem(storageKey))
    if (existingStorage == null) existingStorage = []
    var parseText = JSON.parse(scannedText)
    var key = parseText.comp.toString() + parseText.teamNumber.toString() + parseText.matchNumber.toString()
    existingStorage = existingStorage.filter(element =>{
        var key2 = element.comp.toString() + element.teamNumber.toString() + element.matchNumber.toString()
        if(key == key2){
            return false
        } else return true
    })
    existingStorage.push(parseText)
    existingStorage = appendLinks(existingStorage)
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

function appendLinks(teamData){

    // var teamData = JSON.parse(localStorage.getItem("StorageData"))
    var matchData = {}

    teamData.forEach(matchTeam => {
        var key = matchTeam.comp + matchTeam.alliance + matchTeam.matchNumber
        if (matchData[key] == null) matchData[key] = {events: [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]]}

        var teamEvents = matchTeam.events

        matchData[key].events.forEach((event, index) => {
            var teamEventColumn = teamEvents[index]
            event.map((x, i) => {
                matchData[key].events[index][i] = Math.max(x, teamEventColumn[i])
            })
        })

    });

    teamData.forEach(matchTeam => {
        var key = matchTeam.comp + matchTeam.alliance + matchTeam.matchNumber
        matchTeam.links = findLinks(matchData[key].events)
    })

    // localStorage.setItem("StorageData", JSON.stringify(teamData))
    console.log(matchData)
    return teamData
}