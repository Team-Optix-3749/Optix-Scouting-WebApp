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

// Function to properly process and fix the malformed JSON
function fixJsonFormat(jsonStr) {
    // First, let's handle the problematic comments field pattern
    // Find where "c:" appears and check what follows
    const cIndex = jsonStr.indexOf('"c":') !== -1 ? jsonStr.indexOf('"c":') : jsonStr.indexOf('c:');
    
    if (cIndex !== -1) {
        // Look for the end of the string after 'c:'
        const afterC = jsonStr.substring(cIndex + 3).trim();
        
        if (afterC.startsWith('}') || afterC === '}') {
            // If 'c:' is immediately followed by '}', replace with empty string value
            jsonStr = jsonStr.replace(/([{,])\s*(['"]{0,1})c\2\s*:\s*}/g, '$1"c":""}');
        }
    }
    
    // Step 1: Convert JavaScript object notation to valid JSON
    // Add quotes around property names if they don't have them
    let fixedJson = jsonStr.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    
    // Step 2: Add quotes around string values that don't have them
    fixedJson = fixedJson.replace(/"([^"]+)":\s*([a-zA-Z0-9 ]+)(?=[,}])/g, (match, key, value) => {
        return `"${key}":"${value.trim()}"`;
    });
        
    // Step 3: Handle specific edge cases for the comments field
    fixedJson = fixedJson
        .replace(/"c":\s*$/g, '"c":""')  // Handle empty comment field
        .replace(/"c":\s*}/g, '"c":""}') // Handle comment field at the end of object
        .replace(/"c":\s*,/g, '"c":"",'); // Handle empty comment field before other fields
    
    console.log("Fixed JSON format: " + fixedJson);
    return fixedJson;
}

// Alternative approach: Parse the object directly from JavaScript notation
function parseScannedObject(scannedText) {
    try {
        // First, try to handle common edge cases that might cause syntax errors
        
        // Handle trailing commas in objects
        let cleanedText = scannedText.replace(/,\s*}/g, '}');
        
        // Handle unquoted property names
        cleanedText = cleanedText.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        
        // Handle empty or undefined comments
        cleanedText = cleanedText.replace(/"c"\s*:\s*(?=[\,\}])/g, '"c":""');
        
        // Handle unquoted string values
        cleanedText = cleanedText.replace(/:\s*([a-zA-Z0-9_]+)(\s*[,}])/g, ':"$1"$2');
        
        // Now try to parse it as JSON first (safer approach)
        try {
            return JSON.parse(cleanedText);
        } catch (jsonError) {
            console.warn("JSON parsing failed after cleanup, trying eval approach:", jsonError);
            
            // Add a wrapper to make it a valid JavaScript expression
            const jsExpression = `(${cleanedText})`;
            
            // Use Function constructor instead of eval for slightly better security
            // This creates a function that returns the parsed object
            const parseFunction = new Function('return ' + jsExpression);
            const result = parseFunction();
            
            // If comments field is empty or problematic, set it to empty string
            if (!result.c || result.c === undefined) {
                result.c = "";
            }
            
            return result;
        }
    } catch (e) {
        console.error("Cannot parse with JS eval:", e);
        // Instead of failing completely, return a basic object with error info
        return {
            tnu: teamNumInput.value ? parseInt(teamNumInput.value) : 0,
            m: matchNumInput.value ? parseInt(matchNumInput.value) : 0,
            tna: "Error",
            ta: "",
            a: [0, 0, 0, 0, 0, 0],
            t: [0, 0, 0, 0, 0, 0],
            p: [0, 0, 0],
            d: [0, 0],
            c: "Error parsing: " + scannedText.substring(0, 50) + "..."
        };
    }
}

// Function to store scanned data
function storeScannedData(scannedText) {
    console.log("saving " + scannedText);
    
    try {
        console.log("Attempting to parse scanned text: " + scannedText);
        
        let data;
        // Try first with the fixJsonFormat approach
        try {
            const fixedJson = fixJsonFormat(scannedText);
            data = JSON.parse(fixedJson);
        } catch (jsonError) {
            console.warn("JSON parsing failed, trying alternative approach:", jsonError);
            // If that fails, try the direct JavaScript parsing approach
            data = parseScannedObject(scannedText);
        }
        
        // Apply any team/match number overrides from the UI
        if (teamNumInput.value) {
            data.tnu = parseInt(teamNumInput.value);
        }
        if (matchNumInput.value) {
            data.m = parseInt(matchNumInput.value);
        }
        
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