console.log('The bot is starting');

var Twit = require('twit'); // Like an import statement for node
var config = require('./config');
var T = new Twit(config);


T.get("statuses/user_timeline", {user_id: '807095', count: 200}, function(err, data, response) {
  console.log(data.length); // Whatever you want to do here

  // Get the id of the last tweet
  var last_id = data[data.length-1].id_str;

  // Submit another request using the last_id
  T.get("statuses/user_timeline", {user_id: '807095', count: 200, last_id: last_id}, function(err, data, response) {
      console.log(data.length); // Whatever you want to do here
  })
})
