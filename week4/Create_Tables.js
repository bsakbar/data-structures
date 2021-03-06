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
var queries = []
//Sample SQL statement to create a table: 
queries.push(`CREATE TABLE Address (
    ID int NOT NULL,
    Street VARCHAR(50) NOT NULL,
    City VARCHAR(20) NOT NULL,
    State VARCHAR(2) NOT NULL,
    Zipcode int,
    PRIMARY KEY (ID)
);`);


queries.push(`CREATE TABLE Group_Details (
    ID int NOT NULL,
    AddressID int NOT NULL,
    GroupName VARCHAR(100) NOT NULL,
    Notes VARCHAR(200),
    Wheelchair  BIT,
    PRIMARY KEY (ID),
    FOREIGN KEY (AddressID) REFERENCES Address(ID)
);`);

queries.push(`CREATE TABLE Meeting_Details (
    ID int NOT NULL,
    GroupID int NOT NULL,
    StartTime int NOT NULL,
    EndTime int NOT NULL,
    Day VARCHAR(7),
    MeetingType VARCHAR(40),
    SpecialInterest VARCHAR(50),
    PRIMARY KEY (ID),
    FOREIGN KEY (GroupID) REFERENCES Group_Details(ID)
);`);


queries.push( `CREATE TABLE Geocode (
    ID int NOT NULL,
    AddressID int NOT NULL,
    Longitude double precision NOT NULL,
    Latitude double precision NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (AddressID) REFERENCES Address(ID)
);`);

// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE address;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});


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