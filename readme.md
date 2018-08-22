# Pigeon

Todo
* insert build badges for tests!
* links to sandbox go here

## How it Works
Pigeon is a case management Slack app that allows volunteers to manage a text/chat hotline. Clients text a hotline number, Pigeon opens up a case and a conversation with the client via a chat channel.

### Tech
* Twilio > Smooch > Slack integration opening up a two way conversation between a client and a volunteer
  * Here's an [implementation guide for setting up those integrations]()
* Custom slackbot built off the [Botkit Starter Slack](https://github.com/howdyai/botkit-starter-slack)
  * Our custom Slack commands are in 

### For users
* Each text conversation opens up a new slack channel
* In Slack, a set of custom slash commands support case management functionality, including...
  * `/hello` - checks that Pigeon's properly installed
  * `/cases` - lists all the current cases
  * `/cases_pretty` - lists cases, but prettier
  * `/nextcase` - grabs the next unassigned case
  * `/assign` - assigns a case to a user
  * `/flag` - flags a case any label you write, "needs attention" is the default
  * `/unflag` - unflags a case
  * `/getflags` - returns a list of all flags
  * `/success` - closes a case
  * `/logout` - unassigns all cases for that user (ends their volunteer shift)

## How to Develop Locally

Clone the app and install dependencies with npm
```
git clone git@github.com:CyberSecurityFund/slack-hotline.git
cd slack-hotline
npm install
```

Copy the sample .env file into your own .env
```
cp .env.example .env`
```
Then, enter your client id, secret, and verificationToken (all from the Basic information in Slack). Also specify a port; PORT=3000 (or whatever you want).

NOTE: you do NOT have to set up botkit studio or any of the variables related.  Ignore all the nagware.

Boot up the app!
```
npm run start
```

Now, we need to be able to hit our local app from Slack commands. This requires us to have a public url rather than localhost... enter Ngrok.

To get set up with ngrok, follow the instructions in this tutorial.
https://api.slack.com/tutorials/tunneling-with-ngrok

You'll want to use port 3000 for http (or whatever you specified in .env)
```
ngrok http 3000
```

Once you get your https ngrok url, go to your [Slack bot config](https://api.slack.com/apps). You'll need to update the url in a few places...
* Oauth & Permissions > Redirect URLs section
  * Add the ngrok url PLUS "/oauth"
  * Click "Save URLs"
  * Then go to your ngrok url's homepage and click the 'connect to slack button'
  NOTE: this is for adding a TEAM to your bot -- slack doesn't actually need this step (at least in dev)

* Event Subscriptions > Enable Events
  * Update the Request URL
  * URL should be the ngrok base PLUS "slack/receive"
  * Save Changes!

* Slash commands
  * add the list of all the commands listed at the bottom of `./skills/slash_commands.js`
  * make the 'request url' your ngrok base url PLUS "/slack/receive"
  * CHECK the box 'escape users and channels in your app'



