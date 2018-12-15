const { Client } = require('pg');
var async = require('async');
// AWS RDS POSTGRESQL INSTANCE
// var db_credentials = new Object();
// db_credentials.user = 'bsakbar';
// db_credentials.host = 'batooldb.ck6ozubjtrdo.us-east-1.rds.amazonaws.com';
// db_credentials.database = 'mydb';
// db_credentials.password = process.env.AWSRDS_PW;
// db_credentials.port = 5432;

var db_credentials = new Object();
db_credentials.user = 'batool_2018_db';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'batool_photon_db';
db_credentials.password = process.env.AWSRDS_PW2;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();


// Sample SQL statement to query the entire contents of a table: 
var queries = []
queries.push("SELECT * FROM address;");
queries.push("SELECT count(*) FROM Geocode;");
queries.push("SELECT * FROM Group_Details;");
queries.push("SELECT count(*) FROM Meeting_Details;");
queries.push("SELECT * FROM address JOIN geocode on address.ID=geocode.addressID;");


// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

async.eachSeries(queries, function(value, callback) {

    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = value
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
