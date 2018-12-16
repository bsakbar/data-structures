# Final Assignments

## 1. AA Meetings

[Meetings Endpoint](http://35.170.62.91:8080/aameetings) |  [Meetings Map](http://35.170.62.91:8080/aa)

Expanding on the first steps where we:
- parsed the html files to extract relevant data for the AA meetings. 
- organized the data into a JSON format. 
- made a request to the Texas A&M Geoservices Geocoding APIs for each address.
- cleaned the data:
```javascript
function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}
$('h4').each(function(i, elem) {
    
    addressline1 = $(elem).parent().text().split('\n')[3].trim()
    addressline2 = $(elem).parent().text().split('\n')[4].trim()
```
In the code above, I tried to standardize the format of the data, and since we were dealing with addresses only, I trimmed the addresses by using a function where it checked if the character was a number or NAN. [Function Source](https://stackoverflow.com/questions/8935632/check-if-character-is-number)
- Then we started working with databases (that was cool), and sketched a data model (a SQL one) for the meetings to be stored in the DB. The structure of [my model](https://github.com/bsakbar/data-structures/blob/master/week4/AA%20Meetings%20.png) consists of 4 tables:

| Meeting Details  | Geocode | Group Details | Addresses |
| --- | --- | --- | --- |
| id | id | id | id |
| groupid | addressid | addressid | street
| start time | longitude | group name | city
| end time | latitude | notes | state
| day |  | wheelchair | zipcode
| meeting type |
| special interest |

- created the tables in the DB, inserted the data, ran queries to make sure the data had been populated successfully. 
```javascript
var thisQuery = "SELECT * FROM address;";
var thisQuery = "SELECT * FROM geocode;";
var thisQuery = "SELECT count(*) FROM address JOIN geocode on address.ID=geocode.addressID;";
```
- we executed a query to filter meetings based on the final visualization.
```javascript
    var thisQuery = `SELECT b.Latitude, b.Longitude, json_agg(json_build_object('street', a.Street, 'city', a.City, 'state', a.State, 'zipcode', a.zipcode, 'groupname', c.GroupName, 'notes', c.Notes, 'wheelchair', c.Wheelchair)) as meetings
                 FROM address a 
                 JOIN geocode b on a.ID=b.addressID
                 JOIN Group_Details c on a.ID=c.addressID
                 GROUP BY b.Latitude, b.Longitude;`;
```
- finally the visualization: a map using Leaflet, that shows the meeting locations *(using the longitude and latitude in a function)*, the bindPopup function shows more details *(Group Details: name, notes, wheelchair accessibility)*  when the marker is clicked. 
```javascript
for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
 ```
 *Note: Some locations are outside of Manhattan, which could be because of Texas Geocoding APIs. ( I found it strange especially because I used the longitudes and latitudes for locations).*
 
 ## 2. Dear Diary
 
 [Dear Diary Endpoint](http://35.170.62.91:8080/deardiary) | [Diary Visualization](http://35.170.62.91:8080/dd)
 
I enjoyed this assignment because I got to utilize my habbit of taking [photos of sunsets](https://github.com/bsakbar/data-structures/blob/master/sunset_photos/Screen%20Shot%202018-12-16%20at%2012.17.20%20AM.png) in a project. 
The data of the photos are:
 1. time of the photo. 
 ```javascript
this.time.M = {"day": {"S": time.day}, "time": {"S": time.time} }
```
 2. location of the photo. *("mkan" means location in Arabic, for an unknown reason I used it)*
 ```javascript
 this.mkan= {};
    this.mkan.S = location;
 ```
 3. colors of photo *(I used illustrator eyedropper tool to get the color code)*.
 ```javascript
 if (colors != null) {
        this.colors = {};
        this.colors.SS= colors;
    }
 ```   
 4. weather description and temperature.
 ```javascript
this.weather.M = { "temperature": {"N": weather.temperature}, "description" : {"S": weather.description} }
```
 5. photo filters if any. 
 ```javascript
this.filters.M = {"light" : {"M" : {"exposure": {"N": filters.light.exposure}, "contrast": {"N": filters.light.contrast}, "shadows": {"N": filters.light.shadows} } }, 
                      "color" : {"M" : {"saturation": {"N": filters.color.saturation}, "warmth": {"N": filters.color.warmth}, "tint": {"N": filters.color.tint} } } 
 }
```
 - We kickedoff the project with desinging a non–schema model for the DD data to be stored in DynamoDB. My [data model](https://github.com/bsakbar/data-structures/blob/master/week5/noSQL-data%20model.png) is basically a tree chart, some branches have sub–branches and some dont, which makes the "noSQL" choice of desiging the model perfect. 
 - Then we populated the database with the diary enteries. ([screenshot of the table on DynamoDB](https://github.com/bsakbar/data-structures/blob/master/week5/Screen%20Shot%202018-10-11%20at%2011.36.18%20PM.png)).
 - Like we did for the AA Meetings, we executed a NoSQL query to filter diary entries based on the final visualization. 
 ```javascript
 var params = {
        TableName : "deardiary",
        ProjectionExpression : "weather, colors"
 }
 ```
 - I used p5.js for the final visualization, I decided to include the colors, weather description and the temperature.


  ## 3. Photocell Sensor
 
 [Sensor Endpoint](http://35.170.62.91:8080/sensor) | [Sensor Visualization](http://35.170.62.91:8080/ss)

This was the most interesting project in my opinion, I was fascinated by the sensor's abilities, very tiny but collects a lot of data. I've been working with a [photoresistor](https://github.com/bsakbar/data-structures/blob/master/week8/Photoresistor_2.png), I am measuring the light exposure in my livingroom, the device has been sitting on my TV stand, next to a table lamp and between two windows. 
 
 - We started with setting up the new photon and Particle console, to register a Particle.variable() with the cloud to read brightness levels.
 ```javascript
int photoresistor = A0;

int analogvalue; 

void setup() {
    pinMode(photoresistor,INPUT);
    Particle.variable("analogvalue", &analogvalue, INT);
}

void loop() {
    analogvalue = analogRead(photoresistor);
    delay(100);
}
```
 - We sat up a single variable that was accessible by the Partciel API, so we modified the URL with the device ID and the access token:(https://api.particle.io/v1/devices/260026000947373034353237/analogvalue?access_token=1ae454d3f4d52817deb767d7bc611681442c49d8), the variable returned as a JSON string, that showed the vlaue, device information and status. 
```
{
    cmd: "VarReturn",
    name: "analogvalue",
    result: 1030,
        coreInfo: {
            last_app: "",
            last_heard: "2018-12-16T16:32:42.682Z",
            connected: true,
            last_handshake_at: "2018-12-16T16:32:38.380Z",
            deviceID: "260026000947373034353237",
            product_id: 6
        }
}
```
- We created a table for the sensor in the database and began dropping values to the table every 5 minutes.
- I used Postgres to store my sensor's data. 
```javascript
var thisQuery = "DROP TABLE IF EXISTS sensorData; CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";
```
- At that point, the sensor still wasn't able to write values by its own. So we wrote a script that would run continuously in the background, and send the values to the database every 5 minutes.
```javascript
var sv = JSON.parse(body).result;
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO sensorData VALUES (" + sv + ", DEFAULT);";
        
        setInterval(getAndWriteData, 300000);
```
- Then we created a web server application in Node.js to respond to requests for JSON data that include only the data we need for the visualization. 
```javascript
// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);

    // SQL query 
    // var q = `SELECT sensorValue, COUNT (*) as c FROM sensorData GROUP BY sensorValue ORDER BY c;`
    // var q = `SELECT * FROM sensorData;`
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
```
In my case, the original written data looked like [this](https://github.com/bsakbar/data-structures/blob/master/week9/test.json), but I wanted to abstract the data so I calculated the average/hour instead of every 5 minutes. 
Here how it looks now:

```
[
    {
        value: "1308",
        hour: 0,
        day: 1
    },
     {
        value: "1290",
        hour: 1,
        day: 1
    },
    {
        value: "1267",
        hour: 2,
        day: 1
    }
]
```
-My final visualization works as a calendar, I used [Google Charts](https://developers.google.com/chart/interactive/docs/gallery/scatterchart), each day is a scatter plot, the x–axis is for the time, and y–axis is for the value. If mouse hovers over the diamond icons, a small popup window shows the time and value.

The original sketch had a filtering options; filter by month or value.

![](https://github.com/bsakbar/data-structures/blob/master/week8/Photocell_sketch.png)

But since we only have data for one month, I decided to go with the popup window only. This is the live data:

![](https://github.com/bsakbar/data-structures/blob/master/Final_Assignments/Links/scatterplot_function.png =30x30)

- It's noticable that there's some missing data in days 17-21, it's because it hasnt completed 30 days yet, and I started collecting the data on November 22nd. The data will be automatically added when a new day starts. 
