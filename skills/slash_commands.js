module.exports = function(controller) {

  controller.on('slash_command', function(bot, message) {
    bot.replyPublic(message, 'foooo my app')
    console.log('SLASH COMMAND', message)
  })


}
