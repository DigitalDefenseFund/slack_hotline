const sharedHelpers = require('./shared.js')

const success = module.exports = {}

success.call = function(controller, bot, message){
  var label;
  if(!label){
    label = 'successful'
  }
  bot.replyPublic(message,'You have successfully closed this conversation.')

  sharedHelpers.setChannelProperty(controller, message, 'success', label, function(err, chan){

    bot.api.channels.archive({token:bot.config.bot.app_token, channel: chan.id}, function(err, response){
      // console.log(err, response)
    })
  })
}