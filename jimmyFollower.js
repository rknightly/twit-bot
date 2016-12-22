console.log('The bot is starting');

var Twit = require('twit'); // Like an import statement for node
var config = require('./config');
var T = new Twit(config);

var stream = T.stream('user');

var userList = [];
var userNum = 0;

var postLimit = 15;
var currentPost = 1;

function canPost() {
    var can = currentPost <= postLimit;
    if (!can) {
        console.log("Tried to post past post limit");
    } else {
        console.log("Post # " + currentPost + '/' + postLimit);
    }

    return can;
}

function resetPosts() {
    currentPost = 1;
    console.log("New 15 minute period");
}

function startPostCounter() {
    setInterval(resetPosts, 1000 * 60 * 15);
}

startPostCounter();

function userSearchResponse (err, data, response) {
    console.log("======+++++++Search Response Received+++++++=========");
    if (err) {
        console.log('An error occured');
    } else {
        //Extract relevant data
        for(i=0; i<data.length; i++) {
            var user = data[i];

            if (!user.following) {
                // console.log('Found: ' + user.name);
                userList.push({
                    screen_name: user.screen_name,
                    id: user.id
                })
            } else {
                console.log("Already following " + user.name);
            }
        }
    }
}

function findUsers(name, numOfPeople) {
    // Calculate the required number of pages
    pageCount = Math.ceil(numOfPeople/20)

    // Request each page
    for(var page=1; page<=pageCount; page++) {
        var searchParams = {
            q: name,
            page: page
        };

        T.get('users/search', searchParams, userSearchResponse);
    }
    return userList;
}

function tweetIt(txt) {
    var tweet = {
        status: txt
    }

    if (canPost()) {
        T.post('statuses/update', tweet, tweeted);
        currentPost++;
    }

    function tweeted(err, data, response) {
        if (err) {
            console.log("Something went wrong!");
            console.log(err);
        } else {
            console.log("Just Tweeted: " + txt);
        }
    }
}

function followUser(username, id) {
    console.log("Trying to follow", username, id);
    function handleResponse(err, data, response) {
        if (err) {
            console.log("!!!!+++++ SOMETHING WENT WRONG ++++++!!!!!")
            console.log("Error with following user")
            console.log(err);
        } else {
            console.log('Followed: @' + username);
        }
    }

    if (canPost()) {
        T.post('friendships/create', {user_id: id, follow: true}, handleResponse);
        currentPost++;
    }

}

function greetUser(username, id) {
    followUser(username, id);

    var greetings = [
        "Great name! It really rolls off the tongue",
        "I wish I had a name like yours!",
        "Hey, your parents are pretty cool to name you Jimmy",
        "Woah, you took my name! I want it back!",
        "There isn't enough room for 2 Jimmys in this town",
        "I bet you wish your name was as cool as mine. Not everyone can be great",
        "Nice name!",
        "Nice username, I tried to get that one",
        "I'm not salty at all, I'm just admiring your username",
        "Are you gonna eat that?",
        "You may be Jimmy, but you surely don't have big boots",
        "We can do this the easy way or the hard way, inferior Jimmy",
        "Let's go, Twitter battle ASAP. I just gotta tighten my boots first",
        "You thought you could stand a chance? Think again! Big boots beat all",
        "Hey Jim",
        "Want some boots?",
        "Welcome to the party!",
        "Yooooooooooooo!!!!",
        "Wahooooo, another member!",
        "You have been awoken",
        "Welcome to the dark side of the force",
        "We will take on this world together",
        "Long lost twins?",
        "Finally found you!!",
        "It's like we're the same person!",
        "If you think it's okay to take my username like that, you've been soarly misled.",
        "Yo! Welcome to the club",
        "You are the chosen one.",
        "Lucky winner! You get to join the movement",
        "You are a part of something grand"
    ]

    greetingIndex = Math.floor(greetings.length * Math.random());
    tweetText = '@' + username + ' ' + greetings[greetingIndex];
    tweetIt(tweetText);
}

function nextHit() {
    console.log("At user", userNum + '/' + userList.length);
    console.log(userList.length - userNum, "users remaining");

    var user = userList[userNum];
    greetUser(user.screen_name, user.id);

    userNum++;
}

function followJimmys() {
    findUsers("Jimmy", 800);
    // Don't call initially because results aren't in yet
    setInterval(nextHit, 1000 * 60 * 5);
}

function followMissedFollowers() {
    console.log("Following missed followers");

    function gotFollowers(err, data, response) {
        if (err) {
            console.log("A problem occured with trying to list followers");
            console.log(JSON.stringify(err, null, 4));
        } else {
            followers = data.users;
            // Follow each user in the list
            for (i=0; i<followers.length; i++) {
                user = followers[i];
                if (!user.following) {
                    followUser(user.screen_name, user.id_str);
                }
            }
        }
    }
    T.get('followers/list', gotFollowers);
}

function autoRefollow() {
    followMissedFollowers();
    function followed(eventMsg) {
        var screen_name = eventMsg.source.screen_name;
        var id = eventMsg.source.id;

        //Ignore it if the event is following myself
        if (id == 809980076129419300) {
            return;
        }

        console.log("Followed by", "@" + screen_name);

        followUser(screen_name, id_str);
    }
    stream.on('follow', followed);
}

// TODO: use 'since' perameter to avoid extra results
function likeMentions() {
    function liked(err, data, response) {
        if (err) {
            console.log("A problem occured while liking a tweet");
            console.log(JSON.stringify(data, null, 4));
        } else {
            console.log("Successfully liked a tweet mentioning me");
        }
    }

    function gotMentions(err, data, response) {
        if (err) {
            console.log("Something went wrong! Error with checking mentions");
        } else {
            //Go through each tweet with a mentions
            for (i=0; i<data.length; i++) {
                tweetData = data[i];
                if (tweetData.favorited) {
                    continue;
                } else {
                    // Use id_str because of inaccuracy with regular id
                    console.log('ID:', tweetData.id_str);
                    if (canPost()) {
                        T.post('favorites/create', {id: tweetData.id_str}, liked);
                        currentPost++;
                    }
                }
            }
        }
    }
    T.get('statuses/mentions_timeline', gotMentions);
}

function autoLikeMentions() {
    setInterval(likeMentions, 1000 * 30);
}

function getRateLimit() {
    function gotData(err, data, response) {
        var importantData = data.lists;
        console.log(JSON.stringify(data, null, 4));
        console.log("Important: ", importantData);
    }
    T.get('application/rate_limit_status', {resources:'statuses'}, gotData);
}

function createRandomTime(minMinutes, maxMinutes) {
    var minMilliseconds = minMinutes * 1000 * 60;
    var maxMilliseconds = maxMinutes * 1000 * 60;

    var randomMilliseconds = minMilliseconds + Math.random() * (maxMilliseconds - minMilliseconds);
    return Math.floor(randomMilliseconds);
}

function followNextJimmy() {
    if (userList.length === 0) {
        findUsers("Jimmy", 800);
    } else {
        var nextJimmy = userList[userNum];
        followUser(nextJimmy.screen_name, nextJimmy.id);
        userNum++;
    }
}

function randomSpacedFollowJimmys() {
    followNextJimmy();

    function startWait(milliseconds) {
        var minutes = milliseconds / 1000 / 60;
        console.log("Starting new wait period of " + minutes + " minutes");
    }

    randomTime = createRandomTime(1, 6);
    startWait(randomTime);
    setTimeout(randomSpacedFollowJimmys, randomTime);
}

// followJimmys();
// autoRefollow();
// autoLikeMentions();
randomSpacedFollowJimmys();
