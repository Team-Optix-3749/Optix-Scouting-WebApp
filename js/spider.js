const ctxRed = document.getElementById('chartRed');
const ctxBlue = document.getElementById('chartBlue');

var currentScores = {
  'Red': [0,0],
  'Blue': [0,0]
}

const colors = {
  'red0': 'rgb(255, 22, 71)',
  'red1': 'rgb(255, 108, 71)',
  'red2': 'rgb(255, 174, 71)',
  'blue0': 'rgb(71, 52, 255)',
  'blue1': 'rgb(71, 135, 255)',
  'blue2': 'rgb(71, 222, 255)'
};
const colorsWithAlpha = {
  'red0': 'rgba(255, 22, 71, 0.2)',
  'red1': 'rgba(255, 108, 71, 0.2)',
  'red2': 'rgba(255, 174, 71, 0.2)',
  'blue0': 'rgba(71, 52, 255, 0.2)',
  'blue1': 'rgba(71, 135, 255, 0.2)',
  'blue2': 'rgba(71, 222, 255, 0.2)'
}
var curChart = {
  'Red': undefined,
  'Blue': undefined
}

const createDataset = (label, data, color) => ({
  label: label,
  data: data,
  fill: true,
  backgroundColor: colorsWithAlpha[color],
  borderColor: colors[color],
  pointBackgroundColor: colors[color],
  pointBorderColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointHoverBorderColor: colors[color]
})

const createDataGeneric = () => ({
  labels: [
    'Teleop Points',
    'Autonomous Points',
    'Offense',
    'Defense',
    'Charge Station Tele',
    'Charge Station Auto',
  ],
  datasets: [{
    label: 'lmao',
    data: [0, 0, 0, 0, 0, 0],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }]
})
const createConfigGeneric = () => ({
  type: 'radar',
  data: createDataGeneric(),
  options: {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 3
      }
    }
  },
})

function getScores(teamNum){
  var data = JSON.parse(localStorage.getItem("StorageData"))
  var filteredMatches = data.filter((element) =>{
      if (element.teamNumber.toString() == teamNum){
          return true
      } else return false
  })
  var obj = {score: 0, autoScore: 0, matches: 0, upper: 0, middle: 0, lower: 0, offense: 0, defense: 0, breakdowns: 0, teleScore: 0, balanceAuto: 0, balanceTele: 0}

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

      obj.score += score
      obj.autoScore += autoScore
      obj.matches++
      obj.upper += counts[0]
      obj.middle += counts[1]
      obj.lower += counts[2]
      obj.offense += i.offense
      obj.defense += i.defense
      obj.teleScore += teleScore
      obj.balanceAuto += balanceAuto
      obj.balanceTele += balanceTele
  }
  return obj
}

function createChart(color){

  var teamNum0 = document.getElementById(`number${color}0`).value
  var teamNum1 = document.getElementById(`number${color}1`).value
  var teamNum2 = document.getElementById(`number${color}2`).value

  console.log(teamNum0 + "blank")
  console.log(document.getElementById(`number${color}0`))

  var nums = [teamNum0, teamNum1, teamNum2]

  var data = createDataGeneric()
  var config = createConfigGeneric()

  data.datasets = []

  nums.forEach((teamNum, i) => {

    var scoreInfo = getScores(teamNum);

    var avg = (p) => p/scoreInfo.matches;

    var fields = [avg(scoreInfo.score), avg(scoreInfo.autoScore), 
      avg(scoreInfo.offense), avg(scoreInfo.defense), 
      avg(scoreInfo.balanceTele), avg(scoreInfo.balanceAuto)];

    if (teamNum != '')
    data.datasets.push(createDataset(teamNum, fields, color.toLowerCase() + i))

  });

  config.data = data

  var ctx = color == 'Red' ? ctxRed : ctxBlue

  try{
    curChart[color].destroy()
  } catch{
    curChart[color] = new Chart(ctx, config)
    return
  }
  curChart[color] = new Chart(ctx, config)
}

function createCompareChart(color){
  var teamNum0 = document.getElementById(`number${color}0`).value
  var teamNum1 = document.getElementById(`number${color}1`).value
  var teamNum2 = document.getElementById(`number${color}2`).value

  // var teamNumRed0 = document.getElementById(`numberRed0`).value
  // var teamNumRed1 = document.getElementById(`numberRed1`).value
  // var teamNumRed2 = document.getElementById(`numberRed2`).value
  // var teamNumBlue0 = document.getElementById(`numberBlue0`).value
  // var teamNumBlue1 = document.getElementById(`numberBlue1`).value
  // var teamNumBlue2 = document.getElementById(`numberBlue2`).value

  var nums = [teamNum0, teamNum1, teamNum2]

  var data = createDataGeneric()
  var config = createConfigGeneric()

  data.datasets = []

  var highestTele = 0
  var highestAuto = 0

  nums.forEach(teamNum => {
    var scoreInfo = getScores(teamNum)

    var avg = (p) => p/scoreInfo.matches;


    if (avg(scoreInfo.score) > highestTele){
      highestTele = avg(scoreInfo.score)
    }

    if (avg(scoreInfo.autoScore) > highestAuto){
      highestAuto = avg(scoreInfo.autoScore)
    }
  })

  for (const key in currentScores) {
      if (highestTele > currentScores[key][0]){
        currentScores[key][0] = highestTele
      }
      if (highestAuto > currentScores[key][1])
        currentScores[key][1] = highestAuto
  }

  highestTele = currentScores[color][0]
  highestAuto = currentScores[color][1]

  nums.forEach((teamNum, i) => {

    var scoreInfo = getScores(teamNum)

    var avg = (p) => p/scoreInfo.matches;

    var fields = [avg(scoreInfo.score)/highestTele, avg(scoreInfo.autoScore)/highestAuto, 
      avg(scoreInfo.offense)/10, avg(scoreInfo.defense)/10, 
      avg(scoreInfo.balanceTele)/10, avg(scoreInfo.balanceAuto)/12];
    
    

    if (teamNum != '')
    data.datasets.push(createDataset(teamNum, fields, color.toLowerCase() + i))

  });

  config.data = data

  var ctx = color == 'Red' ? ctxRed : ctxBlue

  try{
    curChart[color].destroy()
  } catch{
    curChart[color] = new Chart(ctx, config)
    return
  }
  curChart[color] = new Chart(ctx, config)
}


document.getElementById("submitRed").onclick = () => {
  check = document.getElementById("compare").checked
  if (check){
    createCompareChart('Red')
  } else {
    createChart('Red')
  }
}
document.getElementById("submitBlue").onclick = () => {
  check = document.getElementById("compare").checked
  if (check){
    createCompareChart('Blue')
  } else {
    createChart('Blue')
  }
}