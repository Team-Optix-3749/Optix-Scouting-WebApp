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

        var rnd = (i) => Math.round(i * 100) / 100;
        var avg = (i) => rnd(i/scoreInfo.matches);

        var fields = [teamNum, scoreInfo.matches, avg(scoreInfo.autoAmp), avg(scoreInfo.autoSpeaker), avg(scoreInfo.park), avg(scoreInfo.teleAmp), avg(scoreInfo.teleSpeaker), avg(scoreInfo.harmony), avg(scoreInfo.trap), scoreInfo.humanPlayerAv == -1 ? "" : rnd(scoreInfo.humanPlayerAv), avg(scoreInfo.offense), avg(scoreInfo.defense), avg(scoreInfo.breakdowns)]

        for (var field of fields){
            var td = document.createElement("td")
            td.innerHTML = field
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    });
}