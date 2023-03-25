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

    var tbody = document.getElementById("matches")

    teamNums.forEach(teamNum => {
        var tr = document.createElement("tr")
        var scoreInfo = getScores(teamNum);
        
        var avg = (i) => Math.round((i/scoreInfo.matches) * 100) / 100;

        var fields = [teamNum, scoreInfo.matches, avg(scoreInfo.upper), avg(scoreInfo.middle), avg(scoreInfo.lower), avg(scoreInfo.score), avg(scoreInfo.autoScore), avg(scoreInfo.links), avg(scoreInfo.offense), avg(scoreInfo.defense), avg(scoreInfo.breakdowns)]

        for (var field of fields){
            var td = document.createElement("td")
            td.innerHTML = field
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    });
}