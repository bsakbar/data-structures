const { Client } = require('pg');
var async = require('async');
var fs = require('fs');
var cheerio = require('cheerio');

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
// let id = 1


// Zone 2 Meetings
// var addressesForDb = JSON.parse(fs.readFileSync('data/aaddress2.json'));
/*id = 1
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

id = 1

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO Geocode VALUES (" + id + ", "+ id + ", "+value.OutputGeocodes[0].OutputGeocode.Longitude+", "+value.OutputGeocodes[0].OutputGeocode.Latitude+");";
    id += 1
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
});

id = 1
var content = fs.readFileSync('data/groupDetails2.txt');
var $ = cheerio.load(content);
var lines = $.text().split("\n")
var groups = [];
var i = 0;
while(i<lines.length-3){
    var group_name = lines[i+1].split('Group_Name:')[1];
    var notes = '';
    var next_line = lines[i+2].split(' ')[1];
    // console.log(group_name,next_line)
    if (next_line == "["){
        i = i+ 2
        notes = notes + lines[i].split("'")[1]
        var last_character = lines[i].split("'")[2]
        i = i + 1
        while(last_character == ','){
            notes = notes + lines[i].split("'")[1]
            last_character = lines[i].split("'")[2]
            i = i + 1
        }
        var wheelchair = lines[i].split(' ')[1];
        if (wheelchair=='true'){
            wheelchair = 1
        }else{
            wheelchair = 0
        }
        i = i + 1
    }else {
     var wheelchair = lines[i+2].split(' ')[1];
     if (wheelchair=='true'){
            wheelchair = 1
        }else{
            wheelchair = 0
        }
     i = i + 3
    }
    // console.log(wheelchair,notes)
    groups.push([group_name,notes,wheelchair])
}
console.log(groups)
async.eachSeries(groups, function(value, callback) {
    // console.log(value)
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO Group_Details VALUES (" + id + ", "+ id + ", E'"+value[0]+ "', E'"+value[1]+"', E'"+value[2]+"');";
    id += 1
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 

var id_offset = 3
var content = fs.readFileSync('data/meetingDetails2.txt');
var $ = cheerio.load(content);
var lines = $.text().split("\n")
var meetings = [];
var i = 0;
while(i < lines.length-1){
    var day = lines[i].split("'")[1];
    var line = lines[i].split(" ");
    
    var meeting_id = line[0] + line[1];
    var new_meeting_id = meeting_id;
    var group_id = line[0]
    // console.log(meeting_id,new_meeting_id)
    i += 1;
    var iter = 2;
    var notes = '';
    line = lines[i].split(" ");
    new_meeting_id = line[0] + line[1];
    
    while(meeting_id == new_meeting_id){
        // console.log(meeting_id,new_meeting_id)
        if (iter == 2){
            var starttime = lines[i].split("'")[1];
            var endtime = lines[i].split("'")[3];
            iter += 1;
        }else if(iter == 3){
            var meeting_type = lines[i].split("'")[1];
            iter += 1
        } else {
            notes = lines[i].split("'")[1];
        }
        i = i+ 1
        line = lines[i].split(" ");
        new_meeting_id = line[0] + line[1];
    }
    meetings.push([Number(meeting_id), Number(group_id), Number(starttime[0]), Number(endtime[0]), day, meeting_type, notes])
    // console.log(starttime,endtime)
}
console.log(meetings)
for (let i=0; i<meetings.length; i++){
    for (let j=0; j<4; j++){
        if (isNaN(meetings[i][j])){
            console.log(meetings[i][j])
        }
    }
}
async.eachSeries(meetings, function(value, callback) {
    // console.log(value)
    const client = new Client(db_credentials);
    client.connect();
    console.log(value)
    // int g_id = value[1] - id_offset
    var thisQuery = "INSERT INTO Meeting_Details VALUES (" + parseInt(value[0]) + ", "+ parseInt(value[1])-id_offset + ", "+ parseInt(value[2]) + ", "+ parseInt(value[3]) +", E'"+value[4]+"', E'"+value[5]+"', E'"+value[6]+"');";
    // var thisQuery = "INSERT INTO Meeting_Details VALUES (" + 0 + ", "+ 1 + ", "+ 2 + ", "+ 3 +", E'"+value[4]+"', E'"+value[5]+"', E'"+value[6]+"');";
    // id += 1
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); */


// Zone 1 Meetings
var addressesForDb = JSON.parse(fs.readFileSync('data/aaddress1.json'));
// var id = 30
// async.eachSeries(addressesForDb, function(value, callback) {

//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Address VALUES (" + id + ", E'" + value.InputAddress.StreetAddress + "', E'" + value.InputAddress.City + "', E'" + value.InputAddress.State + "', " + 00000 +");";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// var id = 30
// async.eachSeries(addressesForDb, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Geocode VALUES (" + id + ", "+ id + ", "+value.OutputGeocodes[0].OutputGeocode.Longitude+", "+value.OutputGeocodes[0].OutputGeocode.Latitude+");";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// var id = 30
// var content = fs.readFileSync('data/groupDetails1.txt');
// var $ = cheerio.load(content);
// var lines = $.text().split("\n")
// var groups = [];
// var i = 0;
// while(i<lines.length-3){
//     var group_name = lines[i+1].split('Group_Name:')[1];
//     var notes = '';
//     var next_line = lines[i+2].split(' ')[1];
//     // console.log(group_name,next_line)
//     if (next_line == "["){
//         i = i+ 2
//         notes = notes + lines[i].split("'")[1]
//         var last_character = lines[i].split("'")[2]
//         i = i + 1
//         while(last_character == ','){
//             notes = notes + lines[i].split("'")[1]
//             last_character = lines[i].split("'")[2]
//             i = i + 1
//         }
//         var wheelchair = lines[i].split(' ')[1];
//         if (wheelchair=='true'){
//             wheelchair = 1
//         }else{
//             wheelchair = 0
//         }
//         i = i + 1
//     }else {
//      var wheelchair = lines[i+2].split(' ')[1];
//      if (wheelchair=='true'){
//             wheelchair = 1
//         }else{
//             wheelchair = 0
//         }
//      i = i + 3
//     }
//     // console.log(wheelchair,notes)
//     groups.push([group_name,notes,wheelchair])
// }
// // console.log(groups)
// async.eachSeries(groups, function(value, callback) {
//     // console.log(value)
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Group_Details VALUES (" + id + ", "+ id + ", E'"+value[0]+ "', E'"+value[1]+"', E'"+value[2]+"');";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// id = 30
// async.eachSeries(addressesForDb, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Meeting_Details VALUES (" + id + ", "+ id + ", "+value.OutputGeocodes[0].OutputGeocode.Longitude+", "+value.OutputGeocodes[0].OutputGeocode.Latitude+");";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// Zone 5 Meetings
// var addressesForDb = JSON.parse(fs.readFileSync('data/aaddress5.json'));
// var id = 52
// async.eachSeries(addressesForDb, function(value, callback) {

//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Address VALUES (" + id + ", E'" + value.InputAddress.StreetAddress + "', E'" + value.InputAddress.City + "', E'" + value.InputAddress.State + "', " + 00000 +");";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// var id = 52
// async.eachSeries(addressesForDb, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO Geocode VALUES (" + id + ", "+ id + ", "+value.OutputGeocodes[0].OutputGeocode.Longitude+", "+value.OutputGeocodes[0].OutputGeocode.Latitude+");";
//     id += 1
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// });

var id = 52
var content = fs.readFileSync('data/groupDetails5.txt');
var $ = cheerio.load(content);
var lines = $.text().split("\n")
var groups = [];
var i = 0;
while(i<lines.length-3){
    var group_name = lines[i+1].split('Group_Name:')[1];
    var notes = '';
    var next_line = lines[i+2].split(' ')[1];
    // console.log(group_name,next_line)
    if (next_line == "["){
        i = i+ 2
        notes = notes + lines[i].split("'")[1]
        var last_character = lines[i].split("'")[2]
        i = i + 1
        while(last_character == ','){
            notes = notes + lines[i].split("'")[1]
            last_character = lines[i].split("'")[2]
            i = i + 1
        }
        var wheelchair = lines[i].split(' ')[1];
        if (wheelchair=='true'){
            wheelchair = 1
        }else{
            wheelchair = 0
        }
        i = i + 1
    }else {
     var wheelchair = lines[i+2].split(' ')[1];
     if (wheelchair=='true'){
            wheelchair = 1
        }else{
            wheelchair = 0
        }
     i = i + 3
    }
    // console.log(wheelchair,notes)
    groups.push([group_name,notes,wheelchair])
}
console.log(groups)
async.eachSeries(groups, function(value, callback) {
    // console.log(value)
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO Group_Details VALUES (" + id + ", "+ id + ", E'"+value[0]+ "', E'"+value[1]+"', E'"+value[2]+"');";
    id += 1
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
