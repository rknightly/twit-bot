# twit-bot
A twitter bot that uses the twit package to perform a variety of tasks.

## What Can The Bot Do?
While the bot can quickly be modified to run different tasks, the bot is currently setup to find all twitter users who have the name 'Jimmy' (or are somehow associated with the name) and follow them at randomly spaced intervals.

The bot is also capable of automatically re-following other users and automatically liking tweets in which the bot was mentioned. In addition, the bot can tweet a random message at each of the users it follows.

## Installing
Because this bot is set up as an NPM package, you can simply run `npm install` in the repository path to install all of the dependencies.

## Configurations
You will need to fill out the config.js file in the lib directory, which looks like this:

```javascript
module.exports = {
    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  '',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
}
```
To get those keys and tokens, you need to register a Twitter Application on the Twitter website.

## Running The bot
The bot can be run by simply running 'npm start' in the repository path.

## Example Account
This particular bot has been operating the Twitter account named JimmyBigBoots.
