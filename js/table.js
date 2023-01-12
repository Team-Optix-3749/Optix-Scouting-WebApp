var hasRun = false
loadData(hasRun)
function loadData(run){
    if(!run){
        if (localStorage.getItem("StorageData") == null){
            clearTable()
        } else {
            var data = JSON.parse(localStorage.getItem("StorageData"))

            for(var i of data) {
                console.log(i)
                dataStor = i
                const team = dataStor.teamNumber
                const match = dataStor.matchNumber
                var UpperScores = 0
                var MiddleScores = 0
                var LowerScores = 0
                dataStor.events.forEach(element => {
                    if(element.name == "Upper"){
                        UpperScores++
                    } else if(element.name == "Middle"){
                        MiddleScores++
                    } else if(element.name == "Lower"){
                        LowerScores++
                    }
                });
                hasRun = true

                var tr = document.createElement("tr");

                var properties = [team, match, UpperScores, MiddleScores, LowerScores, "Delete"]

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

    var value = document.getElementById("filter").value

    var table = document.getElementById("matches")
    var trs = table.getElementsByTagName("tr")

    for (const i of trs) {
        if(i.getElementsByTagName("td").length === 0){
            continue
        }
        var td;
        if(filters == "teamnum"){
            td = i.getElementsByTagName("td")[0]
        } else if(filters == "matchnum"){
            td = i.getElementsByTagName("td")[1]
        }
        if(td.innerHTML.includes(value)){
            i.style.display = ""
        } else {
            i.style.display = "none"
        }
    }

}

function removeMatch(event){

    var removeTd = event.currentTarget
    var tr = removeTd.parentElement
    var matchNum = tr.getElementsByTagName("td")[1].innerHTML
    var teamNum = tr.getElementsByTagName("td")[0].innerHTML
    var key = teamNum + matchNum

    var storage = JSON.parse(localStorage.getItem("StorageData"))

    storage = storage.filter((element) => {
    var key2 = element.teamNumber.toString() + element.matchNumber.toString()
    console.log(key, key2)
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
        <th>Team Number</th>
        <th>Match Number</th>
        <th>Upper Scored</th>
        <th>Middle Scored</th>
        <th>Lower Scored</th>
        <th>Delete</th>
    </tr>`
}


var deleteAllPressed = 2
function deleteAll(){
    if(deleteAllPressed % 2 == 1){
        localStorage.clear()
        loadData(false)
    } else{
        document.getElementById("deleteAll").innerHTML = "Are You Sure?"
    }
    deleteAllPressed++
}