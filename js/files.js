var longText = localStorage.getItem("StorageData");
var longTextCSV = exportCSV()

var dataUri = "data:text/plain;base64," + btoa(longText);
var dataUriCSV = "data:text/plain;base64," + btoa(longTextCSV);

document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)

document.getElementById("downloadLinkCSV").setAttribute("href", dataUriCSV)

document.getElementById("fileUpload").onsubmit = async function(event){
    event.preventDefault()
    var fileInput = document.getElementById("upload");
    var file = fileInput.files[0];
    var content = JSON.parse(await file.text())
    if(localStorage.getItem("StorageData") == null){
        localStorage.setItem("StorageData", JSON.stringify(content))
    } else {
        var existingStorage = JSON.parse(localStorage.getItem("StorageData"))

        if(!Array.isArray(content)){
            existingStorage.push(JSON.parse(content))
        } else{
            content.forEach((c) =>{
            console.log(c)
            existingStorage.push(c)
            })
        }
        localStorage.setItem("StorageData", JSON.stringify(existingStorage))
    }
}

function exportCSV(){

    if (localStorage.getItem("StorageData") == undefined) return;

    var data = JSON.parse(localStorage.getItem("StorageData"))
    var csvData = 'Competition,Team Number,Team Name,Match Number,Upper Scored,Middle Scored,Lower Scored,Total Points,Auto Points'
    data.forEach(el => {
        var comp = el.comp
        var teamNum = el.teamNumber
        var teamName = el.teamName
        var match = el.matchNumber

        var scores = [0, 0, 0]
        el.events.forEach((element, index) => {
            element.forEach(e => {
                scores[index] += e > 0 ? 1 : 0
            })
        })
        var [upperScores, middleScores, lowerScores] = scores

        var score = 0
        var autoScore = 0
        var scoreValuesAuto = [6,4,3]
        var scoreValuesTele = [5, 3, 2]

        el.events.forEach((element, index) => {
            element.forEach(e => {
                if(e==2){
                    autoScore += scoreValuesAuto[index]
                    score += scoreValuesAuto[index]
                } else if (e==1){
                    score += scoreValuesTele[index]
                }
            })
        })

        var endData = comp + "," + teamNum + "," + teamName + "," + match + ","
         + upperScores + "," + middleScores + "," + lowerScores + "," + score + "," + autoScore

        csvData += "\n" + endData;
    })
    return csvData
}
