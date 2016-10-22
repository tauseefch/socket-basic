var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X'));
console.log(now.format('x'));

var timestamp = 1477139019586
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.format());
console.log(timestampMoment.local().format('h:mm a'));


// now.subtract(1, 'year');

// console.log(now.format());

// console.log(now.format('MMM Do YYYY, h:mma'));