var fs = require('fs');
var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, photo_reference, weather, time, filters, colors, location) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.weather = {}; 
    this.weather.M = { "temperature": {"N": weather.temperature}, "description" : {"S": weather.description} }
    this.time = {};
    this.time.M = {"day": {"S": time.day}, "time": {"S": time.time} }
    this.filters={}
    this.filters.M = {"light" : {"M" : {"exposure": {"N": filters.light.exposure}, "contrast": {"N": filters.light.contrast}, "shadows": {"N": filters.light.shadows} } }, 
                      "color" : {"M" : {"saturation": {"N": filters.color.saturation}, "warmth": {"N": filters.color.warmth}, "tint": {"N": filters.color.tint} } } 
                      }
    if (colors != null) {
        this.colors = {};
        this.colors.SS= colors;
    }
    this.mkan= {};
    this.mkan.S = location;
  
  }
}

var data = JSON.parse(fs.readFileSync('diary_data.json'));

for (let i=0; i < data.length; i++) {
    diaryEntries.push(new DiaryEntry(i, data[i].photo_reference, data[i].weather, data[i].time, data[i].filters, data[i].colors, data[i].location));
}
console.log(data.length);
// console.log(diaryEntries[0].filters.M);


var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};
params.Item = diaryEntries[0]; 
params.TableName = "deardiary";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

