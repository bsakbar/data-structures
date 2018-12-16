# Final Assignments

## 1. AA Meetings

Expanding on the first steps where we:
- parsed the html files to extract relevant data for the AA meetings. 
- organized the data into a JSON format. 
- made a request to the Texas A&M Geoservices Geocoding APIs for each address.
- cleaned the data:
```javascript
function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}
$('h4').each(function(i, elem) {
    
    addressline1 = $(elem).parent().text().split('\n')[3].trim()
    addressline2 = $(elem).parent().text().split('\n')[4].trim()
```
In the code above, I tried to standardize the format of the data, and since we were dealing with addresses only, I trimmed the addresses by using a function where it checked if the character was a number or NAN. [Function Source](https://stackoverflow.com/questions/8935632/check-if-character-is-number)
- Then we started working with databases (that was cool), and sketched a data model (a SQL one) for the meetings to be stored in the DB. The structure of [my model](https://github.com/bsakbar/data-structures/blob/master/week4/AA%20Meetings%20.png) consists of 4 tables:

| Meeting Details  | Geocode | Group Details | Addresses |
| --- | --- | --- | --- |
| id | id | id | id |
| groupid | addressid | addressid | street
| start time | longitude | group name | city
| end time | latitude | notes | state
| day |  | wheelchair | zipcode
| meeting type |
| special interest |

- created the tables in the DB, inserted the data, ran queries to make sure the data had been populated successfully. 
```javascript
var thisQuery = "SELECT * FROM address;";
var thisQuery = "SELECT * FROM geocode;";
var thisQuery = "SELECT count(*) FROM address JOIN geocode on address.ID=geocode.addressID;";
```
- finally the [visualization](http://35.170.62.91:8080/aa): a map using Leaflet, that shows the meeting locations *(using the longitude and latitude in a function)*, the bindPopup function shows more details *(Group Details: name, notes, wheelchair accessibility)*  when the marker is clicked. [Meetings Data](http://35.170.62.91:8080/aameetings)
```javascript
for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
 ```
 *Note: Some locations are outside of Manhattan, which could be because of Texas Geocoding APIs. ( I found it strange especially because I used the longitudes and latitudes for locations).*
 
 ## 2. Dear Diary
 
- I enjoyed this assignment because I got to utilize my habbit of taking photos of sunsets in a project. 
The data of the photos are:
 1. time of the photo. 
 ```javascript
this.time.M = {"day": {"S": time.day}, "time": {"S": time.time} }
```
 2. location of the photo. *("mkan" means location in Arabic, for an unknown reason I used it)*
 ```javascript
 this.mkan= {};
    this.mkan.S = location;
 ```
 3. colors of photo *(I used illustrator Eye-Drop tool to get the color code)*.
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
 - Then we populated the database with the diary enteries. ([screenshot of the table on DynamoDB](https://github.com/bsakbar/data-structures/blob/master/week5/Screen%20Shot%202018-10-11%20at%2011.36.18%20PM.png))

 
 
