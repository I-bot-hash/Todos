
module.exports = getDate
function getDate(){

    var today = new Date;
var current = today.getDay();


var options= {
    month : "long",
    weekday : "long",
   day : "numeric"
    
}
var day = today.toLocaleDateString("en-US", options)
return day;
}
