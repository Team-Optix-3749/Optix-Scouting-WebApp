function loadAllAverages(){
    var data = JSON.parse(localStorage.getItem("StorageData"))
    var teamNums = []
    data.forEach(team => {
        if (teamNums == ''){
            teamNums.push(team.teamNumber)
        } else {
            if(!teamNums.includes(team.teamNumber)){
                teamNums.push(team.teamNumber)
            }
        }
    });

    var tbody = document.getElementById("averagesBody")

    teamNums.forEach(teamNum => {
        var tr = document.createElement("tr")
        var scoreInfo = getScores(teamNum);
        var avg = (i) => i/scoreInfo.matches;


        var fields = [teamNum, scoreInfo.matches, avg(scoreInfo.upper), avg(scoreInfo.middle), avg(scoreInfo.lower), scoreInfo.score/scoreInfo.matches, scoreInfo.autoScore/scoreInfo.matches, avg(scoreInfo.links), avg(scoreInfo.offense), avg(scoreInfo.defense), avg(scoreInfo.breakdowns)]

        for (var field of fields){
            var td = document.createElement("td")
            td.innerHTML = field
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    });
}