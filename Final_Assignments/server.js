var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
// var db_credentials = new Object();
// db_credentials.user = 'bsakbar';
// db_credentials.host = process.env.AWSRDS_EP;
// db_credentials.database = 'mydb';
// db_credentials.password = process.env.AWSRDS_PW;
// db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var db_credentials2 = new Object();
db_credentials2.user = 'batool_2018_db';
db_credentials2.host = process.env.AWSRDS_EP;
db_credentials2.database = 'batool_photon_db';
db_credentials2.password = process.env.AWSRDS_PW2;
db_credentials2.port = 5432;

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);

    // SQL query 
    var q = `SELECT ROUND(AVG(sensorValue)) as value, extract(hour from sensorTime) as hour, extract(day from sensorTime) as day FROM sensorData GROUP BY hour,day ORDER BY day;`
    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);
    
    // SQL query 
    // var thisQuery = "SELECT * FROM address ORDER BY address.id;";
    // var thisQuery = "SELECT * FROM Geocode ORDER BY Geocode.id;";
    // var thisQuery = "SELECT * FROM Group_Details ORDER BY Group_Details.id;";
    var thisQuery = `SELECT b.Latitude, b.Longitude, json_agg(json_build_object('street', a.Street, 'city', a.City, 'state', a.State, 'zipcode', a.zipcode, 'groupname', c.GroupName, 'notes', c.Notes, 'wheelchair', c.Wheelchair)) as meetings
                 FROM address a 
                 JOIN geocode b on a.ID=b.addressID
                 JOIN Group_Details c on a.ID=c.addressID
                 GROUP BY b.Latitude, b.Longitude;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "deardiary",
        ProjectionExpression : "weather, colors"
    }

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

var s1x = `<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Photocell Data</title>

<style>

html {
    position: relative;
    height: 100%;
	width: 100%;
}

body {
	background:#091824;
    background-image: url("aurora.svg");
	background-repeat: no-repeat;
	background-size: 100%;
	overflow: hidden;

}

.title{
	margin-top: 80px;
  margin-left: 60px;
	font-size: 50px;
	font-family: sans-serif;
	font-weight: 600;
	color:white;
	letter-spacing: -1px;
}

.description{
	margin-top: -20px;
	margin-left: 60px;
	font-size: 16px;
	font-family: sans-serif;
	font-weight: 200;
	color:white;
}

p{
	padding: 0px;

}

svg{
	padding: 0;
	margin-left: 60px;
	margin-top: 70px;
	width: 1920px;
	height: 1080px;
}

.boxes {
	width:110px;
	height:110px;
    fill:#008f96;
	mix-blend-mode: multiply;
}

.date{
	font-size: 10px;
	font-family: sans-serif;
	font-weight: 200;
	fill:#ffffff;
}



#chart_1, #chart_2, #chart_3,#chart_4,#chart_5,#chart_6, #chart_7,#chart_8,#chart_9,#chart_10,
#chart_11, #chart_12, #chart_13,#chart_14,#chart_15,#chart_16, #chart_17,#chart_18,#chart_19,#chart_20,
#chart_21, #chart_22, #chart_23,#chart_24,#chart_25,#chart_26, #chart_27,#chart_28,#chart_29,#chart_30{
  width: 110px;
  height: 110px;
  position: absolute;
  z-index: 2;
}


</style>

<script type="text/javascript">
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var db_data = `
var s2x = `;
var data_prep = []
      for (let i=0; i<30; i++){
        data_prep.push( [ ['Time', 'Value'] ] )
      }
      for (let i=0; i<db_data.length; i++){
        data_prep[ db_data[i]['day']-1 ].push([ db_data[i]['hour'], parseInt(db_data[i]['value']) ])
      }

      var data = []
      for (let i=0; i<30; i++){
        data.push( new google.visualization.DataTable() )
        data[i].addColumn('number', 'Time');
        data[i].addColumn('number', 'Value');
        for (let j=1; j<data_prep[i].length; j++){
            data[i].addRow([ data_prep[i][j][0], data_prep[i][j][1] ])
        }
      }

      var options = {
        colors: ['#fbdb28'],
        hAxis: {
          baselineColor: 'none',
          title: '',
          textPosition: 'none',
          minValue: 0,
          maxValue: 23,
          gridlines: {
            color: 'transparent'
          }
        },
        vAxis: {
          baselineColor: 'none',
          title: '',
          textPosition: 'none',
          minValue: 1700,
          maxValue: 700,
          gridlines: {
            color: 'transparent'
          }
        },
        pointSize: 1,
        pointShape: 'diamond',
        legend: 'none',
        backgroundColor: { fill:'transparent' },
        chartArea:{left:0,top:0,width:"100%",height:"100%"},

        vAxis: {
          gridlines: {
          color: 'transparent'
        },
          chartArea: {
            backgroundColor: {stroke: '#fff', strokeWidth: 0}
          }
        }
        
      };

    var charts = []
    for (let i=0; i<30; i++){
      charts.push(new google.visualization.ScatterChart(document.getElementById('chart_'+(i+1) ) ));
      charts[i].draw(data[i], options);
    }
  }



</script>
	</head>
  	<body>
      <div class="charts">
        <div id="chart_1" style="margin: 155px 0px"></div>
        <div id="chart_2" style="margin: 155px 120px"></div>
        <div id="chart_3" style="margin: 155px 240px"></div>
        <div id="chart_4" style="margin: 155px 360px"></div>
        <div id="chart_5" style="margin: 155px 480px"></div>
        <div id="chart_6" style="margin: 155px 600px"></div>
        <div id="chart_7" style="margin: 155px 720px"></div>
        <div id="chart_8" style="margin: 155px 840px"></div>
        <div id="chart_9" style="margin: 155px 960px"></div>
        <div id="chart_10" style="margin: 155px 1080px"></div>

        <div id="chart_11" style="margin: 305px 0px"></div>
        <div id="chart_12" style="margin: 305px 120px"></div>
        <div id="chart_13" style="margin: 305px 240px"></div>
        <div id="chart_14" style="margin: 305px 360px"></div>
        <div id="chart_15" style="margin: 305px 480px"></div>
        <div id="chart_16" style="margin: 305px 600px"></div>
        <div id="chart_17" style="margin: 305px 720px"></div>
        <div id="chart_18" style="margin: 305px 840px"></div>
        <div id="chart_19" style="margin: 305px 960px"></div>
        <div id="chart_20" style="margin: 305px 1080px"></div>

        <div id="chart_21" style="margin: 455px 0px"></div>
        <div id="chart_22" style="margin: 455px 120px"></div>
        <div id="chart_23" style="margin: 455px 240px"></div>
        <div id="chart_24" style="margin: 455px 360px"></div>
        <div id="chart_25" style="margin: 455px 480px"></div>
        <div id="chart_26" style="margin: 455px 600px"></div>
        <div id="chart_27" style="margin: 455px 720px"></div>
        <div id="chart_28" style="margin: 455px 840px"></div>
        <div id="chart_29" style="margin: 455px 960px"></div>
        <div id="chart_30" style="margin: 455px 1080px"></div>
      </div>

			<p class="title">Photocell Data</p>
			<p class="description">The boxes below show my sensor's data from November 22nd– December 22nd, the x–axis holds the time of 24 hours, and the y–axis displays
			<br>the value range:700Ω–1700Ω. The sensor measures the light exposure in my livingroom.</p>
		


			<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
   <defs>
      <style>
				.cls-2{
					fill:none;
					stroke:#091824;

					stroke-width:0.5px;
					}
				</style>
   </defs>


		<!-- row1 -->
		<text class="date" x="0" y="10">1</text>
	  <rect class="boxes"x="0" y="15"/>

		<text class="date" x="120" y="10">2</text>
		<rect class="boxes" x="120" y="15"/>

		<text class="date" x="240" y="10">3</text>
		<rect class="boxes" x="240" y="15"/>

		<text class="date" x="360" y="10">4</text>
		<rect class="boxes" x="360" y="15"/>

		<text class="date" x="480" y="10">5</text>
		<rect class="boxes" x="480" y="15"/>

		<text class="date" x="600" y="10">6</text>
		<rect class="boxes" x="600" y="15"/>

		<text class="date" x="720" y="10">7</text>
		<rect class="boxes" x="720" y="15"/>

		<text class="date" x="840" y="10">8</text>
		<rect class="boxes" x="840" y="15"/>

		<text class="date" x="960" y="10">9</text>
		<rect class="boxes" x="960" y="15"/>

		<text class="date" x="1080" y="10">10</text>
		<rect class="boxes" x="1080" y="15"/>
		<!-- row2 -->
		<text class="date" x="0" y="160">11</text>
		<rect class="boxes" x="0" y="165"/>
		<text class="date" x="120" y="160">12</text>
		<rect class="boxes" x="120" y="165"/>

		<text class="date" x="240" y="160">13</text>
		<rect class="boxes" x="240" y="165"/>

		<text class="date" x="360" y="160">14</text>
		<rect class="boxes" x="360" y="165"/>

		<text class="date" x="480" y="160">15</text>
		<rect class="boxes" x="480" y="165"/>

		<text class="date" x="600" y="160">16</text>
		<rect class="boxes" x="600" y="165"/>

		<text class="date" x="720" y="160">17</text>
		<rect class="boxes" x="720" y="165"/>

		<text class="date" x="840" y="160">18</text>
		<rect class="boxes" x="840" y="165"/>

		<text class="date" x="960" y="160">19</text>
		<rect class="boxes" x="960" y="165"/>

		<text class="date" x="1080" y="160">20</text>
		<rect class="boxes" x="1080" y="165"/>
		<!-- row3 -->
		<text class="date" x="0" y="310">21</text>
		<rect class="boxes" x="0" y="315"/>

		<text class="date" x="120" y="310">22</text>
		<rect class="boxes" x="120" y="315"/>

		<text class="date" x="240" y="310">23</text>
		<rect class="boxes" x="240" y="315"/>

		<text class="date" x="360" y="310">24</text>
		<rect class="boxes" x="360" y="315"/>

		<text class="date" x="480" y="310">25</text>
		<rect class="boxes" x="480" y="315"/>

		<text class="date" x="600" y="310">26</text>
		<rect class="boxes" x="600" y="315"/>

		<text class="date" x="720" y="310">27</text>
		<rect class="boxes" x="720" y="315"/>

		<text class="date" x="840" y="310">28</text>
		<rect class="boxes" x="840" y="315"/>

		<text class="date" x="960" y="310">29</text>
		<rect class="boxes" x="960" y="315"/>

		<text class="date" x="1080" y="310">30</text>
		<rect class="boxes" x="1080" y="315"/>
  </svg>

    </body>
</html>`

app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);

    // SQL query 
    var q = `SELECT ROUND(AVG(sensorValue)) as value, extract(hour from sensorTime) as hour, extract(day from sensorTime) as day FROM sensorData GROUP BY hour,day ORDER BY day;`

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <style>
  
  #mapid { height: 100vh; } </style>
  
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
   
<script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
   
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  
   
   
</head>
<body>
<div id="mapid"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
var jx = `;


    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1IjoiYnNha2JhciIsImEiOiJjam14em1hNmQweHZlM3FwbHVtbmQ5eXdoIn0.XgXo8yf68EhBjNTZ6nXhpg'
    }).addTo(mymap);


    
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;
    
    

// respond to requests for /aameetings
app.get('/aa', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);
    
    // SQL query 
    var thisQuery = `SELECT b.Latitude as lat, b.Longitude as lon, json_agg(json_build_object('street', a.Street, 'city', a.City, 'state', a.State, 'zipcode', a.zipcode, 'groupname', c.GroupName, 'notes', c.Notes, 'wheelchair', c.Wheelchair)) as meetings
                 FROM address a 
                 JOIN geocode b on a.ID=b.addressID
                 JOIN Group_Details c on a.ID=c.addressID
                 GROUP BY lat, lon;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

var d1 = `<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* remove default padding and center the sketch on the page */
    html, body {
      height:100%;
      padding:0;
      margin:0;
      background:#e5e5e5; }

    body {
      display:flex;
      justify-content:center;
      align-items:center;
    }
    img{
      width: 350px;
      position: absolute;
      margin: -190px -60px;
    }

  </style>
  <link href="https://fonts.googleapis.com/css?family=Rokkitt" rel="stylesheet">

  <script src="lib/p5.min.js"></script>
  <script src="lib/p5.dom.min.js"></script>

  <script language="javascript" type="text/javascript">
  var gap = 22;
  var offset = 14;
  var sqSide = 98;
  var marginX = 121;
  var marginY = 250;
  var textX = 121;
  var textY = 645;


  function preload() {
    fontLight = loadFont('Fonts/Ubuntu-Light.ttf');
    fontReg = loadFont('Fonts/Ubuntu-Regular.ttf');
  }

  function setup(){
  createCanvas(700,700);
  }


  function draw(){
    background(255);
    noFill();
    noStroke();
    rect(350,350,699,699);

    var data = `

var d2 = `;

    for (var row = 0; row < 3; row++){
      for (var col = 0; col < 4; col++){
        var sqX = marginX + col * (sqSide + gap)
        var sqY = marginY + row * (sqSide + gap)
        for (var i = 0; i < 7; i++){
          noStroke();
          fill(data[4*row+col]['colors']['SS'][i]);
          rect(sqX, sqY + i*offset, sqSide, sqSide/7);
        }
        if(mouseX > sqX && mouseX < sqX + sqSide && mouseY > sqY && mouseY < sqY + sqSide){
          fill(42,49,104,20);
          rect(sqX, sqY, sqSide, sqSide);
          textAlign(LEFT);
          textFont(fontLight);
          textSize(10);
          fill(50);
          text(data[4*row+col]['weather']['M']['description']['S']+'    |   '+data[4*row+col]['weather']['M']['temperature']['N'],textX, textY);
        }
      }
    }


  }

  </script>
</head>
<body>
<img src="SVG/DD_svg.svg">

</body>
</html>
`

app.get('/dd', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "deardiary",
        ProjectionExpression : "weather, colors"
    }

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            var resp = d1 + JSON.stringify(data.Items) + d2;
            res.send(resp);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
})