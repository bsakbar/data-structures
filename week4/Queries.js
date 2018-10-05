const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'bsakbar';
db_credentials.host = 'batooldb.ck6ozubjtrdo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();


// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM address;";
// var thisQuery = "SELECT * FROM geocode;";
var thisQuery = "SELECT * FROM address JOIN geocode on address.ID=geocode.addressID;";


client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
