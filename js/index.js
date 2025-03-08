// HTML elements
const cameraSelect = document.getElementById('cameras');
const startScanningButton = document.getElementById('startScanning');
const scanNextButton = document.getElementById('scanNext');
const saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');
const readerDiv = document.getElementById('reader');
const statusText = document.getElementById('statusText');
const savedIndicator = document.getElementById('savedIndicator');
const teamNumInput = document.getElementById('teamNum');
const matchNumInput = document.getElementById('matchNum');

// Global variables
let html5QrCode;
let currentData = null;

// Initialize the QR code scanner
function initScanner() {
    html5QrCode = new Html5Qrcode("reader");
    
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            // Populate camera select dropdown
            cameraSelect.innerHTML = '';
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.id;
                option.text = device.label;
                cameraSelect.appendChild(option);
            });
        }
    }).catch(err => {
        console.error('Error getting cameras', err);
    });
}

// Event listeners
document.getElementById('startScanning').onclick = function() {
    startScanning();
};

document.getElementById('scanNext').onclick = function() {
    if (currentData) {
        storeScannedData(currentData);
        statusText.innerText = "Status: Saved, ready for next scan";
        currentData = null;
    } else {
        startScanning();
    }
};

// Function to safely evaluate a JavaScript object expression
function safeEvalObject(text) {
    // Clean up the text by ensuring property names and string values are properly quoted
    let cleanedText = text
        // Add quotes to property names if they don't have them
        .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        // Convert single quotes to double quotes for JSON compatibility
        .replace(/'/g, '"')
        // Handle empty arrays correctly
        .replace(/\[\s*\]/g, '[]');
    
    try {
        // Try to parse as JSON first
        return JSON.parse(cleanedText);
    } catch (jsonError) {
        console.warn("JSON parsing failed, using Function constructor:", jsonError);
        
        try {
            // If JSON parsing fails, use Function constructor (safer than eval)
            // This allows us to handle JavaScript object literal syntax
            return Function('"use strict"; return (' + text + ')')();
        } catch (fnError) {
            console.error("Function parsing failed:", fnError);
            throw new Error("Unable to parse scanned data");
        }
    }
}

// Function to store scanned data
function storeScannedData(scannedText) {
    console.log("saving " + scannedText);
    
    try {
        console.log("Attempting to parse scanned text: " + scannedText);
        
        // Parse the scanned data
        const data = safeEvalObject(scannedText);
        
        // Apply any team/match number overrides from the UI
        if (teamNumInput.value) {
            data.tnu = parseInt(teamNumInput.value);
        }
        if (matchNumInput.value) {
            data.m = parseInt(matchNumInput.value);
        }
        
        // Ensure all required fields exist
        if (!data.c) data.c = "";
        
        // Get existing data from localStorage or initialize empty array
        let storageData = [];
        if (localStorage.getItem("StorageData")) {
            storageData = JSON.parse(localStorage.getItem("StorageData"));
        }
        
        // Add new data
        storageData.push(data);
        
        // Save back to localStorage
        localStorage.setItem("StorageData", JSON.stringify(storageData));
        
        // Update UI
        savedIndicator.style.display = "block";
        setTimeout(() => {
            savedIndicator.style.display = "none";
        }, 2000);
        
        // Clear current data
        currentData = null;
        statusText.innerText = "Status: Data saved successfully";
        
    } catch (e) {
        console.error("Error parsing scanned text:", e);
        statusText.innerText = "Status: Error - Invalid QR Code format";
    }
}

// Function to start scanning
function startScanning() {
    const cameraId = cameraSelect.value;
    
    html5QrCode.start(
        cameraId, 
        {
            fps: 10,
            qrbox: 250
        },
        (qrCodeMessage) => {
            // On successful scan
            console.log(`QR Code detected: ${qrCodeMessage}`);
            html5QrCode.stop();
            
            currentData = qrCodeMessage;
            statusText.innerText = "Status: QR Code Detected - Ready to save";
        },
        (errorMessage) => {
            // Ignoring errors during scanning
        }
    ).catch((err) => {
        console.error(`Unable to start scanning: ${err}`);
        statusText.innerText = "Status: Camera Error";
    });
}

// Function to stop scanning
function stopScanning() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log('QR Code scanning stopped');
        }).catch((err) => {
            console.error('Error stopping QR Code scanning', err);
        });
    }
}

// Save button event handler
saveButton.onclick = function() {
    if (currentData) {
        storeScannedData(currentData);
    } else {
        statusText.innerText = "Status: No data to save";
    }
};

// Cancel button event handler
cancelButton.onclick = function() {
    currentData = null;
    statusText.innerText = "Status: Cancelled";
    stopScanning();
};

// Initialize scanner when page loads
window.onload = function() {
    initScanner();
};