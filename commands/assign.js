const shared = require('./shared')

const assign = module.exports = {}

assign.call = function(controller, bot, message, channel) {
  var volunteer = (message.text.match(/\<\@(\w+)/) || [message.user_id]).pop()
  setCaseAssignment(controller, message, channel || null, volunteer, function(err, chan) {
    if (chan) {
      bot.replyPublic(message, '<@'+volunteer+'> assigned to <#'+chan.id+'>')
    }
  });
}

function setCaseAssignment(controller, message, channel, volunteer, cb) {
  shared.setChannelProperty(controller, message, 'assignment', volunteer, function(err, chan) {
    cb(err, chan)
  }, (channel && channel.id))
}