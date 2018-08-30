const shared = require('./shared')

const flag = module.exports = {}

flag.call = function(controller, bot, message) {
  let label = message.text.replace(/.*>/,'').trim()

  if (!label) {
    label = 'needs attention'
  }
  if (message.command == '/unflag') {
    label = null
  }
  shared.setChannelProperty(
    controller, message,
    'label', label,
    function(err, chan) {
      bot.replyPublic(message, message.command.slice(1) + 'ged')
    })
}