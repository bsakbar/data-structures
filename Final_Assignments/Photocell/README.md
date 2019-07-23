# Photocell Sensor

*This was a data structure class project at Parsons School of Design*
 <!-- [Sensor Endpoint](http://35.170.62.91:8080/sensor) | [Sensor Visualization](http://35.170.62.91:8080/ss) -->

I enjoyed working on this project. I've been working with a [photoresistor](https://github.com/bsakbar/data-structures/blob/master/week8/Photoresistor_2.png), I measured the light exposure in my livingroom, the device had been sitting on my TV stand, next to a table lamp and between two windows.

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
 - We sat up a single variable that was accessible by the Particle API, so we modified the URL with the device ID and the access token:(https://api.particle.io/v1/devices/260026000947373034353237/analogvalue?access_token=1ae454d3f4d52817deb767d7bc611681442c49d8), the variable returned as a JSON string, that showed the value, device information and status.
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
In addition, the value ranges from 700Ω–1700Ω, the higher the position of the icon on the plot, the higher the value, which indicates that there was low light, because the more light the lower resistance.

The original sketch had a filtering options; filter by month or value.

![](https://github.com/bsakbar/data-structures/blob/master/week8/Photocell_sketch.png)

But since we only have data for one month, I decided to go with the popup window only. This is a screenshot of the live visualization:

![](https://github.com/bsakbar/data-structures/blob/master/Final_Assignments/Links/scatterplot_function.png)

- It's noticeable that there's some missing data in days 17-21, it's because it hasn't completed 30 days yet, and I started collecting the data on November 22nd. The data will be automatically added when a new day starts.


___
