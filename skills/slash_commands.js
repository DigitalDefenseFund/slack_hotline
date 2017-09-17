const VERIFY_TOKEN = process.env.verificationToken

function get_channel_history(channel, bot, cb){
	// https://github.com/howdyai/botkit/issues/840 : overwriting bot_token with app_token
	bot.api.channels.history({token: bot.config.bot.app_token,channel:channel.id, count:3,unreads:true},function(err,response){
		// console.log("history", response);
		console.log("history", JSON.stringify(response));
		cb(err, response);
	});
}

function open_spaces(controller, bot, message){
	// channels that only have 1 user in it AND
	// 	- patient was the last to respond (unread or read)
	// 	- no activity for X amt of time
	bot.api.channels.list({},function(err,response) {
		var channel_list = [];
		for (var i = 0, l = response.channels.length; i < l; i++) {
			var channel = response.channels[i];
		  if (!channel.is_private && !channel.is_archived && !channel.is_general) {
		  	if (/^sk-/.test(channel.name)){
		  		channel_list.push(channel.name);
		  	}
		  }
		}
		bot.replyPublic(message, channel_list.join(', '));
		// bot.replyPublic(message, 'here are cases');
	  // num_members: 2,
	});
}

module.exports= function(controller){

  controller.on('slash_command', function (bot, message) {
    // Validate Slack verify token
    if (message.token !== VERIFY_TOKEN) {
      return bot.res.send(401, 'Unauthorized')
    }
    switch (message.command) {
      case '/hello':
        bot.replyPublic(message, 'hello there')
        break
      case '/opencases':
      	open_spaces(controller, bot, message);
        break;
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })

}; //module.export
