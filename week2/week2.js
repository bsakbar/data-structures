var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('../week1/data/m02.txt');
var $ = cheerio.load(content);
var streetAddress = '';
var addressline1, addressline2;

// https://stackoverflow.com/questions/8935632/check-if-character-is-number
function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}


$('h4').each(function(i, elem) {
    
    addressline1 = $(elem).parent().text().split('\n')[3].trim()
    addressline2 = $(elem).parent().text().split('\n')[4].trim()
    
    console.log(addressline1);
    console.log(addressline2);
    if ( isNumeric(addressline1[0]) ){
        streetAddress += addressline1 + ' ';
        streetAddress += addressline2 + '\n';
    }
});

fs.writeFileSync('streetAddress2.txt', streetAddress);