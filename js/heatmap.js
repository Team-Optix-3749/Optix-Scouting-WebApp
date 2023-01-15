var storage = JSON.parse(localStorage.getItem("StorageData"))
var teamNum = 0
var matches = 0
var data = [[2,0,0,2,0,0,2,0,0],[0,0,0,1,0,2,1,0,0],[0,1,0,0,0,0,0,1,1]]
var canvas = document.getElementById("canva")
var height = 900
canvas.height = height
var width = 300
canvas.width = width
canvas.style.width = 150
canvas.style.height = 450

document.getElementById("input").onsubmit = function(event) {
    event.preventDefault()
    matches = 0
    teamNum = document.getElementById("teamNum").value
    updateHeatmap()
    console.log(teamNum)
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
            ctx.font = `${sq/5}px comic sans ms`;
            ctx.fillText((e.toFixed(3)), i * sq + sq/5, j * sq + sq/2)
            j++
        });
        i++
    });
}