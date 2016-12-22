console.log('The bot is starting');

var Twit = require('twit'); // Like an import statement for node

var config = require('./config');
var T = new Twit(config);

// Setting up a user stream
var stream = T.stream('user');

//Any time someone follows me
stream.on('follow', followed);

function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;

    tweetIt('@' + screenName + 'you joined the movement! Congradulations! #Domination')
}

// tweetIt();
// setInterval(tweetIt, 1000*20)

var params = {
    q: 'big boots',
    lang: 'en',
    count: 2
}

T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
    var tweets = data.statuses;
    for (var i=0; i < tweets.length; i++) {
        console.log(tweets[i].text);

    }
}

function tweetIt(txt) {
    var r = Math.floor(Math.random()*100);
    var tweet = {
        status: txt
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log("Something went wrong!");
        } else {
            console.log("It worked!");
        }
    }
}
