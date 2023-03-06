var longText = localStorage.getItem("StorageData");
var longTextCSV = exportCSV()

var dataUri = "data:text/plain;base64," + btoa(longText);
var dataUriCSV = "data:text/plain;base64," + btoa(longTextCSV);

document.getElementById("downloadLinkJSON").setAttribute("href", dataUri)

document.getElementById("downloadLinkCSV").setAttribute("href", dataUriCSV)

function generateID(scout){
    return `${scout.teamNumber}-${scout.matchNumber}-${scout.comp}`
}

document.getElementById("fileUpload").onsubmit = async function(event){
    event.preventDefault()

    var fileInput = document.getElementById("upload");
    var file = fileInput.files[0];
    var content;
    try{
        content = JSON.parse(await file.text())
        document.getElementById("error").style.display = "block"
        document.getElementById("error").innerHTML = "Good JSON"
    } catch (e){
        console.log("You Silly Goose " + e)
        document.getElementById("error").innerHTML = "Bad JSON"
        document.getElementById("error").style.display = "block"
        return
    }
    if(localStorage.getItem("StorageData") == null){
        localStorage.setItem("StorageData", JSON.stringify(content))
    } else {
        var existingStorage = JSON.parse(localStorage.getItem("StorageData"))

        if(!Array.isArray(content)){
            var contentID = generateID(content)
            existingStorage = existingStorage.filter((cont) => {
                return generateID(cont) != contentID
            })
            existingStorage.push(content)
        } else{
            content.forEach((c) =>{
                var contentID = generateID(c)
                existingStorage = existingStorage.filter((cont) => {
                    return generateID(cont) != contentID
                })
                existingStorage.push(c)
            })
        }
        localStorage.setItem("StorageData", JSON.stringify(existingStorage))
    }
    document.getElementById("error").style.display = "block"
    document.getElementById("error").innerHTML = "Saved"
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

// document.getElementById("insertData").onsubmit = (event) => {
//     event.preventDefault()

//     var existingData = localStorage.getItem('StorageData')
//     var rawData = document.getElementById("manualData").value
//     var data

//     try {
//         data = JSON.parse(data)
//     } catch {
//         alert("Wrong Format!")
//         return
//     }
    
    

// }