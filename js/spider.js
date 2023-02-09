const ctx = document.getElementById('chart1');
var curChart;

const dataGeneric = {
  labels: [
    'Teleop Points',
    'Autonomous Points',
    'Defense',
    'Offense',
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
};
const configGeneric = {
  type: 'radar',
  data: dataGeneric,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 3
      }
    }
  },
};

document.getElementById("submit").onclick = () => {
  const storageData = localStorage.getItem("StorageData")
  var teamNum = document.getElementById("number").value


  var scoreInfo = getScores(teamNum);
  var avg = (i) => i/scoreInfo.matches;
  var fields = [avg(scoreInfo.score), avg(scoreInfo.autoScore), 
    avg(scoreInfo.offense), avg(scoreInfo.defense), 
    avg(scoreInfo.balanceTele), avg(scoreInfo.balanceAuto)];

  var data = dataGeneric
  var config = configGeneric

  data.datasets[0].data = fields
  data.datasets[0].label = teamNum
  config.data = data

  try{
    curChart.destroy()
  } catch{
    return curChart = new Chart(ctx, config)
  }
  curChart = new Chart(ctx, config)
}