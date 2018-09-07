const sharedHelpers = require('./shared.js')

const success = module.exports = {}

success.call = function(controller, bot, message){
  let replyText = 'You have successfully closed this conversation.'

  sharedHelpers.setChannelProperty(controller, message, 'outcome', 'success', message.channel, function(err, chan){
    if (err) { replyText = "Error encountered -- name: " + err.name + ", message: " + err.message }
    bot.api.channels.archive({token:bot.config.bot.app_token, channel: chan.id}, function(err, response){
      if (err) { replyText = "Error encountered -- name: " + err.name + ", message: " + err.message }
    })
  })

  bot.replyPublic(message,replyText)
}