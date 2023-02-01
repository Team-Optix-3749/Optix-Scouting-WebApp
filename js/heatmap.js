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

    var table = document.getElementById("matches")

    var trs = table.getElementsByTagName("tr")

    for (const i of trs) {
        if(i.getElementsByTagName("td").length === 0){
            continue
        }
        var td = i.getElementsByTagName("td")[1]
        if(td.innerHTML.includes(teamNum)){
            i.style.display = ""
        } else {
            i.style.display = "none"
        }
    }
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
            ctx.font = `${sq/4}px comic sans ms`;
            ctx.fillText((e.toFixed(2)), i * sq + sq/4, j * sq + sq/1.75)
            j++
        });
        i++
    });
}

var clicked = 0
document.getElementById("border").onclick = function(){
    if(clicked % 2 == 0){
        var ctx = canvas.getContext("2d")
        var sq = height/9
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(sq - sq/100, 0, sq/50, sq * 9)
        ctx.fillRect(sq + sq - sq/100, 0, sq/50, sq * 9)
        for (let i = 1; i < 9; i++) {
            ctx.fillRect(0, sq * i - sq/100, sq * 3, sq / 50)
        }
    } else {
        matches = 0
        updateHeatmap()
    }
    clicked++
}