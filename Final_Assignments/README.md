# Final Assignments

## 1. AA Meetings

Expanding on the first steps where we:
- parsed the html files to extract relevant data for the AA meetings. 
- organized the data into a JSON format. 
- made a request to the Texas A&M Geoservices Geocoding APIs for each address.
- cleaned the data:
```ruby
function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}
$('h4').each(function(i, elem) {
    
    addressline1 = $(elem).parent().text().split('\n')[3].trim()
    addressline2 = $(elem).parent().text().split('\n')[4].trim()
```
In the code above, I tried to standardize the format of the data, and since we were dealing with addresses only, I trimmed the addresses by using a function where it checked if the character was a number or NAN. [Function Source](https://stackoverflow.com/questions/8935632/check-if-character-is-number)
- We started working with databases (that was cool), and sketched a data model (a SQL one) for the meetings to be stored in the DB. The structure of my model consists of 4 tables:

![My Model](https://github.com/bsakbar/data-structures/blob/master/week4/AA%20Meetings%20.png =250x)


- Later 
