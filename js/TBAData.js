
const link = "https://www.thebluealliance.com/api/v3"

$.ajaxSetup({
    headers: {
        'X-TBA-Auth-Key': 'LckgK7jWmITgnBODZiGKVqjU9kHo1GeknTbIrw3NJY1qIzEombAfU1BIlyGHm8Zv',
    }
})

async function getSpecificTeamScore(team, comp){
    var data = await $.get(link + `/team/${team.toString()}/event/${comp}/matches/simple`)
    return getAverageMatchScore(data, team)
}

function getAverageMatchScore(data, team){
    var list = [0]
    var totalScore = 0
    data.forEach(matches => {
        for (const alliance in matches.alliances) {
            element = matches.alliances[alliance]
            if(element.team_keys.includes(team)){
                list.push(element.score) 
                totalScore += element.score
            }
        }
    });
    list.splice(0, 1)
    return totalScore/data.length
}

async function getTeamKeys(comp){
    var keys = [0]
    var data = await $.get(`https://www.thebluealliance.com/api/v3/event/${comp}/teams/simple`)
    data.forEach(teamData => {
        keys.push(teamData.key)
    })
    keys.splice(0, 1)
    return keys
}

getTeamKeys("2022casd").then((data) => {
    data.forEach(element => {
        getSpecificTeamScore(element, "2022casd").then(val => {
            console.log(element + ": " + val)
        })
    })
})


