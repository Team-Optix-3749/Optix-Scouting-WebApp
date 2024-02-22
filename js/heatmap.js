var storage = JSON.parse(localStorage.getItem("StorageData"))
var teamNum = ""
var matches = 0
var data = [[2,0,0,2,0,0,2,0,0],[0,0,0,1,0,2,1,0,0],[0,1,0,0,0,0,0,1,1]]
var canvas = document.getElementById("canva")
var height = 1800
canvas.height = height
var width = 600
canvas.width = width
canvas.style.width = "150px"
canvas.style.height = "450px"

document.getElementById("input").onsubmit = function(event) {
    event.preventDefault()
    matches = 0
    teamNum = document.getElementById("teamNum").value

    var table = document.getElementById("matches")

    var trs = table.getElementsByTagName("tr")
    
    for (const i of trs) {
        if(i.getElementsByTagName("td").length === 0){
            continue
        }
        var td = i.getElementsByTagName("td")[1]
        if(td.innerHTML == teamNum){
            i.style.display = ""
        } else {
            i.style.display = "none"
        }
    }

    var tr = document.getElementById("averagesData")
    tr.innerHTML = ""

    var scoreInfo = getScores(teamNum);

    var rnd = (i) => Math.round(i * 100) / 100;
    var avg = (i) => rnd(i/scoreInfo.matches);

    var fields = [teamNum, scoreInfo.matches, avg(scoreInfo.autoAmp), avg(scoreInfo.autoSpeaker), avg(scoreInfo.park), avg(scoreInfo.teleAmp), avg(scoreInfo.teleSpeaker), avg(scoreInfo.harmony), avg(scoreInfo.trap), scoreInfo.humanPlayerAv == -1 ? "" : rnd(scoreInfo.humanPlayerAv), avg(scoreInfo.offense), avg(scoreInfo.defense), avg(scoreInfo.breakdowns)]

    for (var field of fields){
        var td = document.createElement("td")
        td.innerHTML = field
        tr.appendChild(td)
    }

    updateHeatmap()

}

function updateHeatmap(){
    
    var heatArray = [[0,0,0,0,0],[0,0,0,0,0]]
    storage.forEach(element => {
        if(element.teamNumber.toString() === teamNum){
            matches++
            element.a3c.forEach((i) => {
                heatArray[0][i-1] = 1;
            });
            element.a5c.forEach((i) => {
                heatArray[0][i-1] = 1;
            });
        }
    });

    var newHeatArray = heatArray.map(row => row.map(point => point/matches))
    var ctx = canvas.getContext("2d")
    var sq = height/5
    var i = 0
    newHeatArray.forEach(element => {
        var j = 0
        element.forEach(e => {
            ctx.fillStyle = `rgb(${e * 255} , 0, 0)`
            ctx.fillRect(i * sq, j * sq, sq, sq)
            ctx.fillStyle = `rgb(255, 255, 255)`
            ctx.font = `${sq/4}px sans serif`;
            ctx.fillText((e.toFixed(2)), i * sq + sq/4, j * sq + sq/1.75)
            j++
        });
        i++
    });

    var sq = height/5
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(sq - sq/100, 0, sq/50, sq * 5)
    ctx.fillRect(sq + sq - sq/100, 0, sq/50, sq * 5)
    for (let i = 1; i < 5; i++) {
        ctx.fillRect(0, sq * i - sq/100, sq * 2, sq / 50)
    }
}

function resetCanvas(){
    var ctx = canvas.getContext("2d")
    ctx.fillRect(0, 0, height/2, height)
}

document.getElementById("reset").onclick = function(){
    clearTable()
    loadHeatmap()
    document.getElementById("averages").innerHTML = 
    `
    <thead>
    <tr>
        <th>Team Number</th>
        <th>Matches</th>
        <th>Amp (Auto)</th>
        <th>Speaker (Auto)</th>
        <th>Parks (Auto)</th>
        <th>Amp (Tele)</th>
        <th>Speaker (Tele)</th>
        <th>Harmony</th>
        <th>Trap</th>
        <th>Human Player</th>
        <th>Offense</th>
        <th>Defense</th>
        <th>Breakdowns</th>
    </tr>
    </thead>
    <tbody>
        <tr id="averagesData"></tr>
    </tbody>
    `
    resetCanvas()
}

var hasRun = false
var totalPoints = 0
var totalAutoPoints = 0
loadHeatmap()

function loadHeatmap(){
    if (localStorage.getItem("StorageData") == null){
        clearTable()
    } else {
        var data = JSON.parse(localStorage.getItem("StorageData"))

        for(var i of data) {
            var dataStor = i
            const team = dataStor.teamNumber
            const teamName = dataStor.teamName
            const match = dataStor.matchNumber
            const comp = dataStor.comp
            const brokeDown = dataStor.break ? "Yes" : "No"
            const comment = dataStor.notes
            const offence = dataStor.offense
            const defence = dataStor.defense
            const alliance = dataStor.alliance
            const autoSpeaker = dataStor.aspeak
            const autoAmp = dataStor.aamp
            const park = dataStor.park ? "Yes" : "No"
            const teleSpeaker = dataStor.tspeak
            const teleAmp = dataStor.tamp
            const harmony = dataStor.harmony
            const trap = dataStor.trap
            const humanPlayer = dataStor.humanPlayer?.length ?? "";

            var tr = document.createElement("tr");

            var properties = [comp, team, teamName, match, alliance, autoSpeaker, autoAmp, park, teleSpeaker, teleAmp, harmony, trap, humanPlayer, offence, defence, brokeDown,"Expand","Delete"]

            for (var i of properties){
                var td = document.createElement("td")
                td.innerHTML = i

                if (i == auto || i == tele){
                    td.innerHTML = ''
                    var ul = document.createElement("ul")
                    i.forEach(element => {
                        var li = document.createElement("li")
                        li.innerHTML = element
                        ul.appendChild(li)
                    });
                    td.appendChild(ul)
                }

                tr.appendChild(td)
            }

            document.getElementById("matches").appendChild(tr)
        }
    }
}



// var clicked = 3

// document.getElementById("border").onclick = function(){
//     if(clicked % 2 == 1){
//         var ctx = canvas.getContext("2d")
//         var sq = height/9
//         ctx.fillStyle = "rgb(255, 255, 255)"
//         ctx.fillRect(sq - sq/100, 0, sq/50, sq * 9)
//         ctx.fillRect(sq + sq - sq/100, 0, sq/50, sq * 9)
//         for (let i = 1; i < 9; i++) {
//             ctx.fillRect(0, sq * i - sq/100, sq * 3, sq / 50)
//         }
//     } else {
//         matches = 0
//         updateHeatmap()
//     }
//     clicked++
// }