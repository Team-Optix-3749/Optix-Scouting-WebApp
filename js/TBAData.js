
const link = "https://www.thebluealliance.com/api/v3"

$.ajaxSetup({
    headers: {
        'X-TBA-Auth-Key': 'Ue5lGW4YPg6MWgRegaABwv95QwTdNPEtenLmxuvF4KNsWeUEdE0X9mYhpBZocHcW',
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

// getTeamKeys("2022casd").then((data) => {
//     data.forEach(element => {
//         getSpecificTeamScore(element, "2022casd").then(val => {
//             console.log(element + ": " + val)
//         })
//     })
// })

async function downloadThings(){
    var data = await $.get(`https://www.thebluealliance.com/api/v3/events/2023`)
    var keys = []
    data.forEach(element => {
        keys.push(element.name)
    });
    console.log(JSON.stringify(keys))

}


