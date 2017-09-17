const VERIFY_TOKEN = process.env.verificationToken

function flag(controller, bot, message) {
  console.log('FLAG', message)
  var channel_id = (message.text.match(/\<\#(\w+)/) || [message.channel_id]).pop()
  var label = message.text.replace(/.*>/,'').trim()
  if (!label) {
    label = 'needs attention'
  }
  console.log('FLAG DATA', channel_id, label)
  console.log('BOT', bot)
  controller.storage.channels.get(channel_id, function(err, channel) {
    if (err || !channel) {
      channel = {id: channel_id}
    }
    if (message.command == '/unflag') {
      delete channel.label
    } else {
      channel.label = label
    }
    controller.storage.channels.save(channel, function(err, d){
      console.log('saved', err, d)
      bot.replyPublic(message, message.command.slice(1) + 'ged')
    })
  })
}

function getFlags(controller, bot, message) {
  controller.storage.channels.all(function(err, channels) {
    bot.replyPublic(message, JSON.stringify(channels))
  })
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
      case '/flag':
      case '/unflag':
        flag(controller, bot, message)
        break
      case '/flags':
        getFlags(controller, bot, message)
        break
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })

}; //module.export
