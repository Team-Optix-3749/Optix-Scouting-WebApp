const ctxRed = document.getElementById('chartRed');
const ctxBlue = document.getElementById('chartBlue');

var currentScores = {
  'Red': [0,0,0,0,0,0],
  'Blue': [0,0,0,0,0,0]
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
    'Auto Speaker',
    'Auto Amp',
    'Tele Speaker',
    'Tele Amp',
    'Harmony',
    'Defense',
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

function createChart(color){

  var teamNum0 = document.getElementById(`number${color}0`).value
  var teamNum1 = document.getElementById(`number${color}1`).value
  var teamNum2 = document.getElementById(`number${color}2`).value

  var nums = [teamNum0, teamNum1, teamNum2]

  var data = createDataGeneric()
  var config = createConfigGeneric()

  data.datasets = []

  nums.forEach((teamNum, i) => {

    var scoreInfo = getScores(teamNum);

    var avg = (p) => p/scoreInfo.matches;

    var fields = [avg(scoreInfo.autoAmp), avg(scoreInfo.autoSpeaker), 
      avg(scoreInfo.teleAmp), avg(scoreInfo.teleSpeaker), 
      avg(scoreInfo.harmony), avg(scoreInfo.defense)];

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
  var highestAutoAmp = 0
  var highestAutoSpeaker = 0
  var highestDef = 0
  var highestHarmony = 0

  nums.forEach(teamNum => {
    var scoreInfo = getScores(teamNum)

    var avg = (p) => p/scoreInfo.matches;


    if (avg(scoreInfo.score) > highestTele){
      highestTele = avg(scoreInfo.score)
    }

    if (avg(scoreInfo.autoScore) > highestAuto){
      highestAuto = avg(scoreInfo.autoScore)
    }
    if (avg(scoreInfo.autoAmp) > highestAutoAmp){
      highestAutoAmp = avg(scoreInfo.autoAmp)
    }
    if (avg(scoreInfo.autoSpeaker) > highestAutoSpeaker){
      highestAutoSpeaker = avg(scoreInfo.autoSpeaker)
    }
    if (avg(scoreInfo.defense) > highestDef){
      highestDef = avg(scoreInfo.highestDef)
    }
    if (avg(scoreInfo.harmony) > highestHarmony){
      highestHarmony = avg(scoreInfo.highestHarmony)
    }
  })

  for (const key in currentScores) {
      if (highestTele > currentScores[key][0]){
        currentScores[key][0] = highestTele
      }
      if (highestAuto > currentScores[key][1])
        currentScores[key][1] = highestAuto
      if (highestAutoAmp > currentScore[key][2]) currentScores[key][2] = highestAutoAmp
      if (highestAutoSpeaker > currentScore[key][3]) currentScores[key][3] = highestAutoSpeaker
      if (highestDef > currentScore[key][4]) currentScores[key][4] = highestDef
      if (highestHarmony > currentScore[key][5]) currentScores[key][5] = highestHarmony

  }

  highestTele = currentScores[color][0]
  highestAuto = currentScores[color][1]
  highestAutoAmp = currentScores[color][2]
  highestAutoSpeaker = currentScores[color][3]
  highestDef = currentScores[color][4]
  highestHarmony = currentScores[color][5]

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
function fillMatch() {
  
}

var comps = ["Rocket City Regional","Arkansas Regional","Southern Cross Regional",
"Arizona West Regional","Arizona East Regional","Canadian Pacific Regional","Brazil Regional",
"Aerospace Valley Regional","Sacramento Regional","Central Valley Regional","Los Angeles Regional",
"Monterey Bay Regional","Orange County Regional","Hueneme Port Regional",
"SDR","San Francisco Regional","Silicon Valley Regional",
"Ventura","Chezy Champs","FIRST Chesapeake District Championship",
"FIRST Championship - FIRST Robotics Competition","Colorado Regional","Colorado Pre-Competition Scrimmage",
"NE District Hartford Event","NE District Waterbury Event","Orlando Regional","Tallahassee Regional",
"South Florida Regional","PCH District Albany Event","PCH District Carrollton Event","Peachtree District Championship",
"PCH District Dalton Event","PCH District Gwinnett Event","PCH District Macon Event","Hawaii Regional",
"Iowa Regional","Idaho Regional","Midwest Regional","Central Illinois Regional","Pregional by ORBIT",
"FIRST Indiana State Championship","FIN District Greenwood Event","FIN District Mishawaka Event",
"FIN District Princeton Event presented by Toyota","FIN District Tippecanoe Event",
"FIRST Israel District Championship","ISR District Event #1","ISR District Event #2","ISR District Event #3",
"ISR District Event #4","Heartland Regional","Bayou Regional","NE District Greater Boston Event",
"NE District SE Mass Event","NE District North Shore Event","NE District Western NE Event",
"NE District WPI Event","CHS District Bethesda MD Event","CHS District Timonium MD Event",
"FIM District Belleville Event presented by Belleville Yacht Club",
"FIRST in Michigan State Championship presented by DTE Foundation","FIM District Detroit Event presented by DTE",
"FIM District Wayne State University Event presented by Magna",
"FIM District Escanaba Event presented by Highline Fast","FIM District Calvin University Event presented by Amway",
"FIM District Jackson Event presented by Consumers Energy Foundation",
"FIM District Kettering University Event #2 presented by Ford","FIM District Kentwood Event presented by Dematic",
"FIM District Kettering University Event #1 presented by Ford","Kettering Week 0 - AM Session",
"Kettering Week 0 - PM Session","FIM District Lakeview Event #2",
"FIM District Lakeview Event #1 presented by Parker-Hannifin","FIM District Lansing Event",
"FIM District Livonia Event presented by Aisin","FIM District LSSU Event",
"FIM District Macomb Community College Event presented by DTE","FIM District Midland Event presented by Dow",
"FIM District Milford Event presented by GM Proving Grounds","FIM District Muskegon Event presented by RENK",
"FIM District Saline Event","FIM District St. Joseph Event presented by Whirlpool Corporation",
"FIM District Standish-Sterling Event","FIM District Troy Event #2 presented by Magna",
"FIM District Troy Event #1 presented by Aptiv","FIM District Traverse City Event presented by Cone Drive",
"FIM District West Michigan Event","Lake Superior Regional","Northern Lights Regional","KnightKrawler Week Zero",
"Minnesota 10,000 Lakes Regional presented by Medtronic","Minnesota North Star Regional at La Crosse",
"Blue Twilight Week Zero Invitational","Greater Kansas City Regional","Central Missouri Regional","St. Louis Regional",
"FIRST Mid-Atlantic District Championship","Magnolia Regional","Regional Monterrey","Regional Puebla","Regional Laguna",
"FNC District UNC Asheville Event","FIRST North Carolina District State Championship",
"FNC District Johnston County Event","FNC District Mecklenburg County Event","FNC District UNC Pembroke Event",
"FNC District Wake County Event","Great Northern Regional","New England FIRST District Championship",
"NE District UNH Event","NE District Granite State Event","FMA District Mount Olive Event",
"FMA District Robbinsville Event","FMA District Montgomery Event","FMA District Seneca Event",
"FMA District Warren Hills Event","Las Vegas Regional","FIRST Long Island Regional #1",
"FIRST Long Island Regional #2","New York City Regional","Finger Lakes Regional",
"Rochester Rally Week 0 Scrimmage","New York Tech Valley Regional","Regal Eagle Rampage",
"Buckeye Regional","Miami Valley Regional","Oklahoma Regional","Green Country Regional",
"ONT District Georgian Event","FIRST Ontario Provincial Championship","ONT District McMaster University",
"ONT District Western University Engineering Event","ONT District Newmarket Complex Event",
"ONT District North Bay Event","ONT District Humber College Event","ONT District University of Waterloo Event",
"ONT District Windsor Essex Great Lakes Event","PNW District Clackamas Academy Event",
"PNW District Oregon State Fairgrounds Event","PNW District Wilsonville Event","FMA District Bensalem Event",
"Greater Pittsburgh Regional presented by Argo AI","FMA District Hatboro-Horsham Event",
"FMA District Springside Chestnut Hill Academy Event","Pacific Northwest FIRST District Championship",
"Festival de Robotique Regional","NE District Rhode Island Event","PCH District Anderson Event presented by Magna",
"PCH District Hartsville Event presented by South Carolina Department of Education","Smoky Mountains Regional",
"Halic Regional","Istanbul Regional","Bosphorus Regional","Izmir Regional","FIT District Amarillo Event",
"FIT District Belton Event","FIT District Channelview Event","FIT District Space City @ Clear Lake Event",
"FIRST In Texas District Championship presented by Phillips 66","FIT District Dallas Event",
"FIT District Fort Worth Event","FIT District Houston Event","FIT District San Antonio Event",
"FIT District Waco Event","Utah Regional","CHS District Alexandria VA Event","CHS District Blacksburg VA Event",
"CHS District Glen Allen VA Event","CHS District Portsmouth VA Event","PNW District Auburn Event",
"PNW District Bonney Lake Event","PNW District Sammamish Event","PNW District Glacier Peak Event",
"PNW District SunDome Event","Week 0","Seven Rivers Regional","Wisconsin Regional",
"Seven Rivers Robotics Coalition Week Zero","Sussex Scrimmage","China Regional (TENTATIVE FOR 2023)"]

comps.forEach(comp => {
  var option = document.createElement("option")
  option.value = comp
  document.getElementById("compList").appendChild(option)
});

function fillMatch(){

  var comp = document.getElementById("selectCompText").value

  var matchNum = document.getElementById("fillTeams").value
  var data = JSON.parse(localStorage.getItem("StorageData"))
  var redTeams = []
  var blueTeams = []
  data.forEach(element => {

    if(element.comp != comp){
      return
    }

    if(element.matchNumber == matchNum){
      if(element.alliance == "Red"){
        redTeams.push(element.teamNumber)
      } else {
        blueTeams.push(element.teamNumber)

      }
    }
  })
  
  redTeams.forEach((element, index) => {
    document.getElementById(`numberRed${index}`).value = element
  })
  blueTeams.forEach((element, index) => {
    document.getElementById(`numberBlue${index}`).value = element
  })

  check = document.getElementById("compare").checked
  if (check){
    createCompareChart('Blue')
    createCompareChart('Red')
  } else {
    createChart('Blue')
    createChart('Red')
  }
}

 

function resetTeamNums(event){
  event.preventDefault()
  var thisEl = event.currentTarget
  var wholeDiv = thisEl.parentElement.parentElement.parentElement
  var children = wholeDiv.children
  for(var i=1; i<4; i++ ){
    children[i].value = ""
  }
  loadCharts()
}

document.getElementById("clear1").onclick = resetTeamNums
document.getElementById("clear2").onclick = resetTeamNums

function loadCharts() {
  check = document.getElementById("compare").checked
  if (check){
    createCompareChart('Blue')
    createCompareChart('Red')
  } else {
    createChart('Blue')
    createChart('Red')
  }
}
document.getElementById("compare").onclick = loadCharts()

document.getElementById("compare").addEventListener(onclick, loadCharts())