var hasRun = false

function loadData(run){
    if(!run){
        var data = JSON.parse(localStorage.getItem("StorageData"))

        for(var i in data) {
            dataStor = data[i]
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

            var properties = [team, match, UpperScores, MiddleScores, LowerScores]

            for (var i of properties){
                var td = document.createElement("td")
                td.innerHTML = i
    
                tr.appendChild(td)
            }

            document.getElementById("matches").appendChild(tr)

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