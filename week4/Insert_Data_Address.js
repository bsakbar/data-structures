const { Client } = require('pg');
var async = require('async');
var fs = require('fs');


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'bsakbar';
db_credentials.host = 'batooldb.ck6ozubjtrdo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var addressesForDb = JSON.parse(fs.readFileSync('../week3/first.json'));
let id = 1
async.eachSeries(addressesForDb, function(value, callback) {

    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO Address VALUES (" + id + ", E'" + value.InputAddress.StreetAddress + "', E'" + value.InputAddress.City + "', E'" + value.InputAddress.State + "', " + 00000 +");";
    id += 1
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 