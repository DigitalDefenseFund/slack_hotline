var Botkit = require('botkit');
var debug = require('debug')('botkit:main');
var shared = require('./commands/shared')

function backpop() {
  var env = require('node-env-file');
  try {
    env(__dirname + '/.env');
  } catch(err) {
    console.log('no .env file to setup environment -- you probably need to do this, unless it is production')
  }

  var bot_options = {
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      // debug: true,
      //scopes: ['bot'],
      scopes: [
        'incoming-webhook',
        'bot',
        'team:read',
        'users:read',
        'channels:read',
        'channels:write',
        'channels:history',
      ],
      //studio_token: process.env.studio_token,
      studio_command_uri: process.env.studio_command_uri
  };

  // Use a mongo database if specified, otherwise store in a JSON file local to the app.
  // Mongo is automatically configured when deploying to Heroku
  if (process.env.MONGO_URI || process.env.MONGODB_URI) {
      var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI});
      bot_options.storage = mongoStorage;
  } else {
      bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
  }

  // Create the Botkit controller, which controls all instances of the bot.
  var controller = Botkit.slackbot(bot_options);

  controller.storage.teams.all(function(error, teams){
    teams.map(function(team){
      var backpopBot = controller.spawn(team.bot);
      // console.log('TEAM', team.id)
      // controller.storage.channels.find({team_id: team.id}, function(err, result){
      //   console.log('CHANNELS', result)
      // })
      shared.syncChannelsToDB(controller, backpopBot, team.id)
    })
  })
}

backpop();