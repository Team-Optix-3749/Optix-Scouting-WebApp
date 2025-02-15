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
            const teamName = dataStor.tna;
            const teamAlliance = dataStor.ta;

            const l1ScoreAuto = dataStor.a[0];
            const l2ScoreAuto = dataStor.a[1];
            const l3ScoreAuto = dataStor.a[2];
            const l4ScoreAuto = dataStor.a[3];
            const netShotsAuto = dataStor.a[4];
            const processorShotsAuto = dataStor.a[5];

            const l1ScoreTeleop = dataStor.t[0];
            const l2ScoreTeleop = dataStor.t[1];
            const l3ScoreTeleop = dataStor.t[2];
            const l4ScoreTeleop = dataStor.t[3];
            const netShotsTeleop = dataStor.t[4];
            const processorShotsTeleop = dataStor.t[5];

            let endgame = "";
            if (dataStor.p[0] == 1) {
                endgame = "shallow";
            } else if (dataStor.p[1] == 1) {
                endgame = "park";
            } else if (dataStor.p[2] == 1) {
                endgame = "deep";
            }

            const defense = dataStor.d[0] === 1 ? true : false;
            const robotBroke = dataStor.d[1] === 1 ? true : false;
            const comments = dataStor.c;

            var tr = document.createElement("tr");

            var properties = [
                match, team, teamName, teamAlliance,
                l1ScoreAuto, l2ScoreAuto, l3ScoreAuto, l4ScoreAuto, netShotsAuto, processorShotsAuto,
                l1ScoreTeleop, l2ScoreTeleop, l3ScoreTeleop, l4ScoreTeleop, netShotsTeleop, processorShotsTeleop,
                endgame, defense, robotBroke, comments, "Expand", "Delete"
            ];

            for (var i of properties){
                var td = document.createElement("td")
                td.innerHTML = i
    
                if(i == "Delete"){
                    td.onclick= removeMatch
                    td.classList = "clickable"
                    td.style = "user-select: none;"
                }

                if(i == "Expand"){
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
    var matchNum = tr.getElementsByTagName("td")[3].innerHTML.toString()
    var teamNum = tr.getElementsByTagName("td")[1].innerHTML.toString()
    var comp = tr.getElementsByTagName("td")[0].innerHTML.toString()
    var key = comp + teamNum + matchNum
    var storage = JSON.parse(localStorage.getItem("StorageData"))
    storage = storage.filter((element) => {
        var key2 = element.comp.toString() + element.teamNumber.toString() + element.matchNumber.toString()
        if(key === key2){
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
        if (element.teamNumber.toString() == teamNum){
            return true
        } else return false
    })
    var obj = {autoSpeaker: 0, teleSpeaker: 0, autoAmp: 0, teleAmp: 0, harmony: 0, trap: 0, humanPlayerAv: 0, park: 0, breakdowns: 0, offense: 0, defense: 0, matches: 0}

    var hpTot = 0;
    var hpCount = 0;

    for(var i of filteredMatches) {
        if(i.break){
            obj.breakdowns++
        }

        obj.autoAmp += i.aamp
        obj.autoSpeaker += i.aspeak
        obj.teleAmp += i.tamp
        obj.teleSpeaker += i.tspeak
        obj.harmony += i.harmony
        obj.trap += i.trap
        obj.park += i.park ? 1 : 0
        obj.offense += i.offense
        obj.defense += i.defense
        obj.matches++

        if (i.hp !== null) {
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
        if (children[i].innerHTML == "Speaker Scored (Auto)"){
            rightHeaderIndexStart = i
        }
      }

    var d = rightHeaderIndexStart
    for (let i = d; i < d+10; i++) {
        let tableChild = children[i];
        tableChild.onclick = sortTable
        tableChild.classList = "clickable"
      }
}

addOnClicks()

function sortTable(event){
    event.preventDefault()
    let column = event.currentTarget
    let tableInfo = document.getElementById("matches")
    let headers = document.getElementById("blank")
    var searchForIndex = -1;

    var d = rightHeaderIndexStart

    for (var i=d; i < d+10; i++){
        if (headers.children[i] == column && headers.children[i].innerHTML.includes("⬇️")){
            headers.children[i].innerHTML = headers.children[i].innerHTML.replace("⬇️","")
            clearTable()
            try {
                loadHeatmap()
            } catch {
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
        return parseFloat(b.children[searchForIndex].innerHTML === "" ? "-5" : b.children[searchForIndex].innerHTML === "") - parseFloat(a.children[searchForIndex].innerHTML === "" ? "-5" : a.children[searchForIndex].innerHTML === "")
    })

    while (tableInfo.firstChild) {
        tableInfo.removeChild(tableInfo.lastChild);
    }

    elementArray.forEach((e) => {
        tableInfo.appendChild(e)
    })
}