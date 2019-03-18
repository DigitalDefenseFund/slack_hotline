const shared = require('./shared')

const assign = module.exports = {}

assign.call = function(controller, bot, message, channel, volunteer) {
  if (!volunteer) {
    volunteer = (message.text.match(/\<\@(\w+)/) || [message.user_id]).pop()
  }
  setCaseAssignment(controller, message, channel || null, volunteer, function(err, chan) {
    if (chan) {
      bot.replyPublic(message, '<@'+volunteer+'> assigned to <#'+chan.id+'>')
		} else {
			bot.replyPublic(message, 'No case channel was provided. Please include the case channel that you want to assign to.') 
		}
  });
}

function setCaseAssignment(controller, message, channel, volunteer, cb) {
  shared.setChannelProperty(controller, message, 'assignment', volunteer, channel, function(err, chan) {
    cb(err, chan)
  })
}
