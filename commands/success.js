const sharedHelpers = require('./shared.js')

const success = module.exports = {}

success.call = function(controller, bot, message){
  console.log('INSIDE THE SUCCESS CALL')
  bot.replyPublic(message,'You have successfully closed this conversation.')

  sharedHelpers.setChannelProperty(controller, message, 'success', 'successful', function(err, chan){
    console.log('CHAN', chan)
    console.log('BOT CONFIG', bot.config)
    console.log('BOT CONFIG BOT', bot.config.bot)
    bot.api.channels.archive({token:bot.config.bot.app_token, channel: chan.id}, function(err, response){
      // console.log(err, response)
    })
  })
}