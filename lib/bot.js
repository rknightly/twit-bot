console.log('The bot is starting');

var outFileName = 'data.txt';

var Twit = require('twit'); // Like an import statement for node
var config = require('./config');
var T = new Twit(config);

var jsonfile = require('jsonfile');

function UserFinder() {
    this.foundUsers = [];

    this.logUser = function(username, userId) {
        var user = (username, userId);
        this.foundUsers.push(user);
    }

    this.userSearchResponse = function (err, data, response) {
        if (err) {
            console.log('An error occured');
        } else {
            importantData = [];

            //Extract relevant data
            console.log(data.length);
            for(i=0; i<data.length; i++) {
                console.log(i, data.length);
                console.log('*****' + data[i].name);

                importantData.push({
                    id: data[i].id,
                    name: data[i].name
                })
            }

            jsonfile.writeFile(outFileName, importantData, {spaces: 2}, function(err) {
                console.error(err)
            });
        }
    }
    this.findUsers = function(name, numOfPeople) {
        // Calculate the required number of pages
        pageCount = Math.ceil(numOfPeople/20)

        // Request each page
        for(var page=1; page<=pageCount; page++) {
            var searchParams = {
                q: name,
                page: page
            };

            T.get('users/search', searchParams, this.userSearchResponse);
        }
        return this.foundUsers;
    }
}

var finder = new UserFinder();
var users = finder.findUsers('Jimmy', 40);

// console.log("Returned Users: " + users);
// console.log("\n\nFound Users:" + finder.foundUsers);
