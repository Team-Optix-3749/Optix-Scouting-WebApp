if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

document.getElementById("scanNext").onclick = () => {
    scannedText = ""
    scanned = false
    document.getElementById("statusText").innerHTML = "Status: Not Scanned"
}

document.getElementById("save").onclick = () => {
    storeScannedData(scannedText)
}

// testing data storage and usage
var scannedText = ''
var scanned = false

function storeScannedData(scannedText) {
    
    if(scannedText == undefined) return;

    const storageKey = 'StorageData'

    var newStorage = ''

    console.log("saving", scannedText)

    if(localStorage.getItem(storageKey) == null){
        newStorage = '[ ' + scannedText + ' ]'
    } else {
        var existingStorage = JSON.parse(localStorage.getItem(storageKey))
        var parseText = JSON.parse(scannedText)
        var key = parseText.comp.toString() + parseText.teamNumber.toString() + parseText.matchNumber.toString()
        existingStorage = existingStorage.filter(element =>{
            var key2 = element.comp.toString() + element.teamNumber.toString() + element.matchNumber.toString()
            if(key == key2){
                return false
            } else return true
        })
        existingStorage.push(parseText)

        newStorage = JSON.stringify(existingStorage)
    }

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

document.getElementById("startScanning").onclick = async () => {
    l = document.getElementById("cameras")
    label = l.options[l.selectedIndex].text
        const html5QrCode = new Html5Qrcode("reader", verbose=false);
        var cameraId = (await getCamera(label)).id
        html5QrCode.start(
            cameraId, 
            {
                fps: 10,
                qrbox: {height:250, width:250}
            },
            (decodedText, decodedResult) => {
                if (scanned) return
                scanned = true

                document.getElementById("statusText").innerHTML = "Status: Scanned"
                console.log(decodedText)
                if (decodedText!= null){
                    scannedText = decodedText
                }
            },
            (errorMessage) => {
                // parse error, ignore it.
            })
            .catch((err) => {
            // Start failed, handle it.
            });
}