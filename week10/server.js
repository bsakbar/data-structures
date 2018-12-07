var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'bsakbar';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

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
    var q = `SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;`

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
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = "SELECT * FROM Group_Details;";

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
    
    // DynamoDB (NoSQL) query
    // var params = {
    //     TableName: "aarondiary",
    //     KeyConditionExpression: "#tp = :topicName", // the query expression
    //     ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
    //         "#tp": "topic"
    //     },
    //     ExpressionAttributeValues: { // the query values
    //         ":topicName": { S: "cats" }
    //     }
    // };
    
    var params = {
        TableName : "deardiary",
        KeyConditionExpression: "pk = :this_pk",
        FilterExpression: "#k_weather.#k_description = :weather and #tm.#dy= :this_day", // the query expression 
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#k_weather" : "weather",
            "#k_description" : "description",
            "#tm" : "time",
            "#dy" : "day"
        },
        ExpressionAttributeValues: { // the query values
            ":this_pk": {N: "2"},
            ":weather": {S: "sunny"},
            ":this_day": {S: "Saturday"}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
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