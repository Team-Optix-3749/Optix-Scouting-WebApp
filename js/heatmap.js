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
    var avg = (i) => i/scoreInfo.matches;


    var fields = [teamNum, scoreInfo.matches, avg(scoreInfo.upper), avg(scoreInfo.middle), avg(scoreInfo.lower), scoreInfo.score/scoreInfo.matches, scoreInfo.autoScore/scoreInfo.matches, avg(scoreInfo.offense), avg(scoreInfo.defense), avg(scoreInfo.breakdowns)]

    for (var field of fields){
        var td = document.createElement("td")
        td.innerHTML = field
        tr.appendChild(td)
    }

    updateHeatmap()

}

function updateHeatmap(){
    
    var heatArray = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    storage.forEach(element => {
        if(element.teamNumber.toString() === teamNum){
            matches++
            element.events.forEach((row, rowNum) => {
                row.forEach((point, colNum) => {
                    heatArray[rowNum][colNum] += point > 0 ? 1 : 0
                });
            });
        }
    });

    var newHeatArray = heatArray.map(row => row.map(point => point/matches))
    var ctx = canvas.getContext("2d")
    var sq = height/9
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

    var sq = height/9
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(sq - sq/100, 0, sq/50, sq * 9)
    ctx.fillRect(sq + sq - sq/100, 0, sq/50, sq * 9)
    for (let i = 1; i < 9; i++) {
        ctx.fillRect(0, sq * i - sq/100, sq * 3, sq / 50)
    }
}

function resetCanvas(){
    var ctx = canvas.getContext("2d")
    ctx.fillRect(0, 0, height/3, height)
}

document.getElementById("reset").onclick = function(){
    clearTable()
    loadData(false)
    document.getElementById("averages").innerHTML = 
    `
    <tr>
    <th>Team Number</th>
    <th>Matches</th>
    <th>Upper Scored</th>
    <th>Middle Scored</th>
    <th>Lower Scored</th>
    <th>Points</th>
    <th>Auto Points</th>
    <th>Offense</th>
    <th>Defense</th>
    <th>Breakdowns</th>
    </tr>
    <tr id="averagesData">
    </tr>
    `
    resetCanvas()
}

var hasRun = false
var totalPoints = 0
var totalAutoPoints = 0
loadData(hasRun)

function loadData(){
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
            const offence = dataStor.offense
            const defence = dataStor.defense
            const balAuto = dataStor.balanced.toString().substring(0, 1)
            const balTele = dataStor.balanced.toString().substring(1, 2)
            const balanceAuto = balAuto === "2" ? "Engaged" : balAuto == "1" ? "Docked" : "Nothing"
            const balanceTele = balTele === "2" ? "Engaged" : balTele == "1" ? "Docked" : "Nothing"


            // upper, lower, middle
            var scores = [0, 0, 0]
            dataStor.events.forEach((element, index) => {
                element.forEach(e => {
                    scores[index] += e > 0 ? 1 : 0
                })
            })
            var [upperScores, middleScores, lowerScores] = scores

            var score = 0
            var autoScore = 0
            var scoreValuesAuto = [6, 4, 3]
            var scoreValuesTele = [5, 3, 2]

            dataStor.events.forEach((element, index) => {
                element.forEach(e => {
                    if(e==2){
                        autoScore += scoreValuesAuto[index]
                        score += scoreValuesAuto[index]
                    } else if (e==1){
                        score += scoreValuesTele[index]
                    }
                })
            })

            hasRun = true

            totalPoints += score
            totalAutoPoints += autoScore

            var tr = document.createElement("tr");

            var properties = [comp, team, teamName, match, upperScores, middleScores, lowerScores, score, autoScore, offence, defence, balanceAuto, balanceTele]

            for (var i of properties){
                var td = document.createElement("td")
                td.innerHTML = i

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