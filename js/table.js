var hasRun = false
var totalPoints = 0
var totalAutoPoints = 0
loadData(hasRun)
function loadData(run){
    if(!run){
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
                const brokeDown = dataStor.break
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
                var scoreValuesAuto = [6,4,3]
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

                var properties = [comp, team, teamName,match, upperScores, middleScores, lowerScores, score, autoScore, brokeDown ? "Yes" : "No","Delete"]

                for (var i of properties){
                    var td = document.createElement("td")
                    td.innerHTML = i
        
                    if(i == "Delete"){
                        td.onclick=removeMatch
                    }

                    tr.appendChild(td)
                }

                document.getElementById("matches").appendChild(tr)
            }
        }
    }
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
    var matchNum = tr.getElementsByTagName("td")[2].innerHTML
    var teamNum = tr.getElementsByTagName("td")[1].innerHTML
    var comp = tr.getElementsByTagName("td")[0].innerHTML
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
    loadData(false)
}

function clearTable(){
    document.getElementById("matches").innerHTML = 
    `<tr>
        <th>Competition</th>
        <th>Team Number</th>
        <th>Team Name</th>
        <th>Match Number</th>
        <th>Upper Scored</th>
        <th>Middle Scored</th>
        <th>Lower Scored</th>
        <th>Total Points</th>
        <th>Broke Down</th>
        <th>Delete</th>
    </tr>`
}


var deleteAllPressed = 2
function deleteAll(){
    if(deleteAllPressed % 2 == 1){
        localStorage.clear()
        loadData(false)
    } else {
        document.getElementById("deleteAll").innerHTML = "Are You Sure?"
    }
    deleteAllPressed++
}

function getScores(teamNum){
    var data = JSON.parse(localStorage.getItem("StorageData"))
    var filteredMatches = data.filter((element) =>{
        if (element.teamNumber.toString().includes(teamNum)){
            return true
        } else return false
    })
    var obj = {score: 0, autoScore: 0, matches: 0, upper: 0, middle: 0, lower: 0, breakdowns: 0}

    for(var i of filteredMatches) {

        var score = 0
        var autoScore = 0
        var scoreValuesAuto = [6, 4, 3]
        var scoreValuesTele = [5, 3, 2]
        var counts = [0,0,0]

        i.events.forEach((element, index) => {
            element.forEach(e => {
                if(e==2){
                    autoScore += scoreValuesAuto[index]
                    score += scoreValuesAuto[index]
                    counts[index]++
                } else if (e==1){
                    score += scoreValuesTele[index]
                    counts[index]++
                }
            })
        })
        if(i.break){
            obj.breakdowns++
        }
        obj.score += score
        obj.autoScore += autoScore
        obj.matches++
        obj.upper += counts[0]
        obj.middle += counts[1]
        obj.lower += counts[2]
    }
    return obj
}