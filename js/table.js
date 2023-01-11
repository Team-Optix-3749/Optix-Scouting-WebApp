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
            document.getElementById("matches").innerHTML += "<tr><td>"+ team +"</td><td>"+ match+ "</td><td>"+ UpperScores +"</td><td>"+ MiddleScores + "</td><td>"+ LowerScores +"</td></tr>"
        }
    }
}