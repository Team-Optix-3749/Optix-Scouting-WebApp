var totalPoints = 0
var totalAutoPoints = 0
function loadData(){
    if (localStorage.getItem("StorageData") == null){
        clearTable()
    } else {
        var data = JSON.parse(localStorage.getItem("StorageData"))

        for(var i of data) {
            var dataStor = i

            const match = dataStor.m;
            const team = dataStor.tnu;
            const teamName = dataStor.tna || "Unknown";
            const teamAlliance = dataStor.ta || "";

            // Make sure arrays exist and have appropriate length
            const autoArray = Array.isArray(dataStor.a) ? dataStor.a : [0, 0, 0, 0, 0, 0];
            const teleopArray = Array.isArray(dataStor.t) ? dataStor.t : [0, 0, 0, 0, 0, 0];
            const parkingArray = Array.isArray(dataStor.p) ? dataStor.p : [0, 0, 0];
            const defenseArray = Array.isArray(dataStor.d) ? dataStor.d : [0, 0];

            // Ensure all arrays have the expected length
            while (autoArray.length < 6) autoArray.push(0);
            while (teleopArray.length < 6) teleopArray.push(0);
            while (parkingArray.length < 3) parkingArray.push(0);
            while (defenseArray.length < 2) defenseArray.push(0);

            const l1ScoreAuto = autoArray[0];
            const l2ScoreAuto = autoArray[1];
            const l3ScoreAuto = autoArray[2];
            const l4ScoreAuto = autoArray[3];
            const netShotsAuto = autoArray[4];
            const processorShotsAuto = autoArray[5];

            const l1ScoreTeleop = teleopArray[0];
            const l2ScoreTeleop = teleopArray[1];
            const l3ScoreTeleop = teleopArray[2];
            const l4ScoreTeleop = teleopArray[3];
            const netShotsTeleop = teleopArray[4];
            const processorShotsTeleop = teleopArray[5];

            let endgame = "";
            if (parkingArray[0] == 1) {
                endgame = "shallow";
            } else if (parkingArray[1] == 1) {
                endgame = "park";
            } else if (parkingArray[2] == 1) {
                endgame = "deep";
            }

            const defense = defenseArray[0] === 1 ? true : false;
            const robotBroke = defenseArray[1] === 1 ? true : false;
            const comments = dataStor.c || "";

            var tr = document.createElement("tr");

            var properties = [
                match, team, teamName, teamAlliance,
                l1ScoreAuto, l2ScoreAuto, l3ScoreAuto, l4ScoreAuto, netShotsAuto, processorShotsAuto,
                l1ScoreTeleop, l2ScoreTeleop, l3ScoreTeleop, l4ScoreTeleop, netShotsTeleop, processorShotsTeleop,
                endgame, defense, robotBroke, comments, "Expand", "Delete"
            ];

            for (var j = 0; j < properties.length; j++){
                var td = document.createElement("td")
                td.innerHTML = properties[j]
    
                if(properties[j] == "Delete"){
                    td.onclick = removeMatch
                    td.classList = "clickable"
                    td.style = "user-select: none;"
                }

                if(properties[j] == "Expand"){
                    td.classList = "clickable"
                    td.style = "user-select: none;"
                    td.onclick = function() {
                        this.classList.toggle("active");
                        var panel = this.children[0];
                        if (panel.style.display === "block") {
                            panel.style.display = "none";
                        } else {
                            panel.style.display = "block";
                        }
                    }
                    var commentDiv = document.createElement("div")
                    commentDiv.className = "panel"
                    commentDiv.innerHTML = comments
                    commentDiv.style.display = "none"
                    td.appendChild(commentDiv)
                }

                tr.appendChild(td)
            }

            document.getElementById("matches").appendChild(tr)
        }
    }
    updateFilter()
}

function updateFilter(){

    var filters = document.getElementById("filters").value

    var value = document.getElementById("filter").value.toLowerCase()

    var table = document.getElementById("matches")
    var trs = table.getElementsByTagName("tr")

    for (const i of trs) {
        if(i.getElementsByTagName("td").length === 0){
            continue
        }
        var td;
        if(filters == "comp"){
            td = i.getElementsByTagName("td")[0]
        } else if(filters == "teamname"){
            td = i.getElementsByTagName("td")[2]
        } else if(filters == "teamnum"){
            td = i.getElementsByTagName("td")[1]
        } else if(filters == "matchnum"){
            td = i.getElementsByTagName("td")[3]
        }
        if(td.innerHTML.toLowerCase().includes(value)){
            i.style.display = ""
        } else {
            i.style.display = "none"
        }
    }

}

function removeMatch(event){
    var removeTd = event.currentTarget
    var tr = removeTd.parentElement
    var matchNum = tr.getElementsByTagName("td")[0].innerHTML.toString()
    var teamNum = tr.getElementsByTagName("td")[1].innerHTML.toString()
    
    var storage = JSON.parse(localStorage.getItem("StorageData"))
    storage = storage.filter((element) => {
        if(element.m == matchNum && element.tnu == teamNum){
            return false
        } else return true
    })
    localStorage.setItem("StorageData", JSON.stringify(storage))
    clearTable()
    loadData()
}

function clearTable(){
    document.getElementById("matches").innerHTML = ""
}


var deleteAllPressed = 2
function deleteAll(){
    if(deleteAllPressed % 2 == 1){
        localStorage.clear()
        loadData()
    } else {
        document.getElementById("deleteAll").innerHTML = "Are You Sure?"
    }
    deleteAllPressed++
}

function getScores(teamNum){
    var data = JSON.parse(localStorage.getItem("StorageData"))
    var filteredMatches = data.filter((element) =>{
        if (element.tnu == teamNum){
            return true
        } else return false
    })
    var obj = {autoSpeaker: 0, teleSpeaker: 0, autoAmp: 0, teleAmp: 0, harmony: 0, trap: 0, humanPlayerAv: 0, park: 0, breakdowns: 0, offense: 0, defense: 0, matches: 0}

    var hpTot = 0;
    var hpCount = 0;

    for(var i of filteredMatches) {
        if(i.d && i.d[1] === 1){
            obj.breakdowns++
        }

        // Check if auto array exists
        if (i.a) {
            obj.autoAmp += (i.a[0] || 0) + (i.a[1] || 0); // Level 1 & 2 considered Amp
            obj.autoSpeaker += (i.a[2] || 0) + (i.a[3] || 0); // Level 3 & 4 considered Speaker
        }
        
        // Check if teleop array exists
        if (i.t) {
            obj.teleAmp += (i.t[0] || 0) + (i.t[1] || 0); // Level 1 & 2 considered Amp
            obj.teleSpeaker += (i.t[2] || 0) + (i.t[3] || 0); // Level 3 & 4 considered Speaker
        }
        
        // Check if parking array exists
        if (i.p) {
            obj.harmony += i.p[0] === 1 ? 1 : 0; // Shallow
            obj.park += i.p[1] === 1 ? 1 : 0; // Park
            obj.trap += i.p[2] === 1 ? 1 : 0; // Deep
        }
        
        // Check if defense array exists
        if (i.d) {
            obj.defense += i.d[0] === 1 ? 1 : 0; // Defense
        }
        
        obj.matches++

        if (i.hp !== undefined && i.hp !== null) {
            hpTot += i.hp.length;
            hpCount++;
        }
    }

    if (hpCount > 0) {
        obj.humanPlayerAv = hpTot / hpCount;
    } else {
        obj.humanPlayerAv = -1;
    }

    return obj
}

var rightHeaderIndexStart

function addOnClicks(){
    let children = document.getElementById("blank").children

    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML == "Level 1 Score (Auto)"){
            rightHeaderIndexStart = i
            break
        }
    }

    if (rightHeaderIndexStart === undefined) {
        rightHeaderIndexStart = 4; // Fallback to likely index if not found
    }

    var d = rightHeaderIndexStart
    for (let i = d; i < d+10; i++) {
        if (i < children.length) {
            let tableChild = children[i];
            tableChild.onclick = sortTable
            tableChild.classList = "clickable"
        }
    }
}

// Call addOnClicks when the document is loaded to ensure HTML elements exist
document.addEventListener('DOMContentLoaded', function() {
    addOnClicks();
});

function sortTable(event){
    event.preventDefault()
    let column = event.currentTarget
    let tableInfo = document.getElementById("matches")
    let headers = document.getElementById("blank")
    var searchForIndex = -1;

    var d = rightHeaderIndexStart

    for (var i=d; i < d+10; i++){
        if (i >= headers.children.length) continue;
        
        if (headers.children[i] == column && headers.children[i].innerHTML.includes("⬇️")){
            headers.children[i].innerHTML = headers.children[i].innerHTML.replace("⬇️","")
            clearTable()
            try {
                loadHeatmap()
            } catch (error) {
                try {
                    loadAllAverages()
                } catch (error) {
                    loadData()
                }
            } // This is a REALLY bad way of doing this
            updateFilter()
            break
        }
        if (headers.children[i] == column){
            headers.children[i].innerHTML += "⬇️"
            searchForIndex = i
        }
        else {
            headers.children[i].innerHTML = headers.children[i].innerHTML.replace("⬇️","")
        }
    }

    if (searchForIndex === -1) return

    var tableRows = tableInfo.children
    var elementArray = []


    for (var i=0; i < tableRows.length; i++){
        elementArray.push(tableRows[i])
    }
    elementArray.sort((a, b) => {
        if (!a.children[searchForIndex] || !b.children[searchForIndex]) return 0;
        
        const aVal = a.children[searchForIndex].innerHTML === "" ? "-5" : a.children[searchForIndex].innerHTML;
        const bVal = b.children[searchForIndex].innerHTML === "" ? "-5" : b.children[searchForIndex].innerHTML;
        
        return parseFloat(bVal) - parseFloat(aVal);
    })

    while (tableInfo.firstChild) {
        tableInfo.removeChild(tableInfo.lastChild);
    }

    elementArray.forEach((e) => {
        tableInfo.appendChild(e)
    })
}