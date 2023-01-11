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

    function storeScannedData(scannedText) {
        if(scannedText != undefined){
        var scannedTextJSON = JSON.parse(scannedText)

        const key = scannedTextJSON.teamNumber + "_" + scannedTextJSON.matchNumber

        // keyKey = "MatchKeys"

        // if (localStorage.getItem(keyKey) == undefined){
        //     localStorage.setItem(keyKey, key)
        // } else{
        //     localStorage.setItem(keyKey, localStorage.getItem(keyKey) +  " " + key)
        // }

        // var keys = []
        // keys.push(key)

        const storageKey = 'StorageData'

        var newStorage = ''

        if(localStorage.getItem(storageKey) == undefined){
            newStorage = '{ "' + key + '": ' + scannedText + ' }'
        } else {
            var existingStorage = localStorage.getItem(storageKey)
            var existingStorageSpace = existingStorage.substr(0, existingStorage.length - 2)

            newStorage = existingStorageSpace + ', "' + key + '": ' + scannedText + ' }'
        }

        localStorage.setItem(storageKey, newStorage)
        }
    }

    var longText = localStorage.getItem("StorageData");
    var dataUri = "data:text/plain;base64," + btoa(longText);
    document.getElementById("statusText").onclick = function(){
        document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)
    }

    // This method will trigger user permissions
    Html5Qrcode.getCameras().then(devices => {

    if (devices && devices.length) {
        var cameraId = devices[1].id;
        const html5QrCode = new Html5Qrcode("reader", verbose=false);
        html5QrCode.start(
            cameraId, 
            {
                fps: 10,
                qrbox: {height:250, width:250}
            },
            (decodedText, decodedResult) => {
                document.getElementById("statusText").innerHTML = "Status: Scanned"
                // csv support
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
        }).catch(err => {
        // handle err
        });

        // testing
        document.getElementById("test").onclick = function(){
            storeScannedData(scannedText)
            console.log(scannedText)
        }