// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// var params = {
//     TableName : "deardiary",
//     KeyConditionExpression: "#k_weather = :weather",
//     // FilterExpression: "#k_weather.#k_description = :weather and #tm.#dy= :this_day", // the query expression 
//     ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
//         "#k_weather" : "weather"
//         // "#k_description" : "description",
//         // "#tm" : "time",
//         // "#dy" : "day"
//     },
//     ExpressionAttributeValues: { // the query values
//         // ":this_pk": {N: "2"},
//         ":weather": {S: "sunny"}
//         // ":this_day": {S: "Saturday"}
//     }
// };

var params = {
        TableName : "deardiary",
        KeyConditionExpression: "weather = :weather and #dy = :day", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dy" : "day"
        },
        ExpressionAttributeValues: { // the query values
            ":weather": {S: "sunny"},
            ":day": {S: "Saturday"}
        }
    };

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});