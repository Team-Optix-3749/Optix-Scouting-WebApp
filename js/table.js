var totalPoints = 0
var totalAutoPoints = 0
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
            const brokeDown = dataStor.break ? "Yes" : "No"
            const comment = dataStor.notes
            const offence = dataStor.offense
            const defence = dataStor.defense
            const alliance = dataStor.alliance
            const links = dataStor.links
            const balAuto = dataStor.balanced.toString().substring(0, 1)
            const balTele = dataStor.balanced.toString().substring(1, 2)
            const mobility = dataStor.mobility === true ? "Yes" : "No"
            const parked = dataStor.park === true ? "Yes" : "No"
            const balanceAuto = balAuto === "2" ? "Engaged" : balAuto == "1" ? "Docked" : "Nothing"
            const balanceTele = balTele === "2" ? "Engaged" : balTele == "1" ? "Docked" : "Nothing"

            const auto = [balanceAuto, mobility]
            const tele = [balanceTele, parked]


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

            const mobilityScore = dataStor.mobility ? 3 : 0
            const parkedScore = dataStor.park ? 2 : 0
            
            score += parkedScore
            autoScore += mobilityScore

            var tr = document.createElement("tr");

            var properties = [comp, team, teamName, match, alliance, upperScores, middleScores, lowerScores, score, autoScore, links, offence, defence, auto, tele, brokeDown,"Expand","Delete"]

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
                    commentDiv.innerHTML = comment
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
    var obj = {score: 0, autoScore: 0, matches: 0, upper: 0, middle: 0, lower: 0, links: 0, offense: 0, defense: 0, breakdowns: 0, teleScore: 0, balanceAuto: 0, balanceTele: 0}

    for(var i of filteredMatches) {

        var score = 0
        var autoScore = 0
        var teleScore = 0
        var scoreValuesAuto = [6, 4, 3]
        var scoreValuesTele = [5, 3, 2]
        var counts = [0,0,0]
        var chargeScoreValuesAuto = [6, 8]
        var chargeScoreValuesTele = [10, 12]

        i.events.forEach((element, index) => {
            element.forEach(e => {
                if(e==2){
                    autoScore += scoreValuesAuto[index]
                    score += scoreValuesAuto[index]
                    counts[index]++
                } else if (e==1){
                    teleScore += scoreValuesTele[index]
                    score += scoreValuesTele[index]
                    counts[index]++
                }
            })
        })
        if(i.break){
            obj.breakdowns++
        }

        const balAuto = i.balanced.toString().substring(0, 1)
        const balTele = i.balanced.toString().substring(1, 2)
        const balanceAuto = balAuto === "2" ? 12 : balAuto == "1" ? 8 : 0
        const balanceTele = balTele === "2" ? 10 : balTele == "1" ? 6 : 0
        const mobility = i.mobility ? 3 : 0
        const parked = i.park ? 2 : 0

        score += parked
        autoScore += mobility

        obj.score += score 
        obj.autoScore += autoScore
        obj.matches++
        obj.upper += counts[0]
        obj.middle += counts[1]
        obj.lower += counts[2]
        obj.links += i.links
        obj.offense += i.offense
        obj.defense += i.defense
        obj.teleScore += teleScore
        obj.balanceAuto += balanceAuto
        obj.balanceTele += balanceTele
    }
    return obj
}

var rightHeaderIndexStart

function addOnClicks(){
    let children = document.getElementById("blank").children

    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML == "Upper Scored"){
            rightHeaderIndexStart = i
        }
      }

    var d = rightHeaderIndexStart
    for (let i = d; i < d+8; i++) {
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

    for (var i=d; i < d+8; i++){
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
        return parseInt(b.children[searchForIndex].innerHTML) - parseInt(a.children[searchForIndex].innerHTML)
    })

    while (tableInfo.firstChild) {
        tableInfo.removeChild(tableInfo.lastChild);
    }

    elementArray.forEach((e) => {
        tableInfo.appendChild(e)
    })
}