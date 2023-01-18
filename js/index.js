    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
        })
    }

   // testing data storage and usage
    var scannedText = ''
    var scanned = false

    function storeScannedData(scannedText) {
        if (scanned) return;

        if(scannedText == undefined) return;

        const storageKey = 'StorageData'

        var newStorage = ''

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

    // This method will trigger user permissions
    Html5Qrcode.getCameras().then(devices => {

    if (devices && devices.length) {
        var cameraId = devices[0].id;
        const html5QrCode = new Html5Qrcode("reader", verbose=false);
        html5QrCode.start(
            cameraId, 
            {
                fps: 10,
                qrbox: {height:250, width:250}
            },
            (decodedText, decodedResult) => {
                document.getElementById("statusText").innerHTML = "Status: Scanned"
                console.log(decodedText)
                if (decodedText!= null){
                    scannedText = decodedText
                }
                storeScannedData(scannedText)
            },
            (errorMessage) => {
                // parse error, ignore it.
            })
            .catch((err) => {
            // Start failed, handle it.
            });
            }
        }).catch(err => {
        // handle err
        });

        // testing
        document.getElementById("test").onclick = function(){
            storeScannedData(scannedText)
            console.log(scannedText)
        }