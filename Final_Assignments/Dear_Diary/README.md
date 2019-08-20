## Dear Diary

This project focused on collecting data, designing a (non)schema object, creating a new managed DynamoDB database, and finally writing a code to populate the database with the "Dear Diary" data. My "Dear Diary" data is [sunset photos](https://github.com/bsakbar/data-structures/blob/master/sunset_photos/Screen%20Shot%202018-12-16%20at%2012.17.20%20AM.png):

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
 - I used p5.js for the final visualization, I decided to include the colors, weather description and the temperature, which were read from DynamoDB and then used it to populate a 4x3 grid of squares. Each square shows the 7 colors of every picture. The weather description and temperature appear when mouse hovers over the square. The script for creating the 4x3 grid visualization is below:

```javascript
for (var row = 0; row < 3; row++){
      for (var col = 0; col < 4; col++){
        var sqX = marginX + col * (sqSide + gap)
        var sqY = marginY + row * (sqSide + gap)
        for (var i = 0; i < 7; i++){
          noStroke();
          fill(data[4*row+col]['colors']['SS'][i]);
          rect(sqX, sqY + i*offset, sqSide, sqSide/7);
        }
        if(mouseX > sqX && mouseX < sqX + sqSide && mouseY > sqY && mouseY < sqY + sqSide){
          fill(42,49,104,20);
          rect(sqX, sqY, sqSide, sqSide);
          textAlign(LEFT);
          textFont(fontLight);
          textSize(10);
          fill(50);
          text(data[4*row+col]['weather']['M']['description']['S']+'    |   '+data[4*row+col]['weather']['M']['temperature']['N'],textX, textY);
        }
      }
    }
```
