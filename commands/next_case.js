const assign = require('./assign')
const shared = require('./shared')

const nextCase = module.exports = {}

nextCase.call = function(controller, bot, message) {
  var volunteer = (message.text.match(/\<\@(\w+)/) || [message.user_id]).pop()
  shared.getTeamChannelsData(controller, bot, message, function(channels) {
    channels.sort(function(a,b) {return ((b.lastTime || 0) - (a.lastTime || 0)) })
    var needsAssign = channels.filter(function(ch) {
      return (!(ch.store && ch.store.assigned) && !ch.api.is_archived && /^sk-/.test(ch.api.name))
    });
    if (needsAssign.length) {
      assign.call(controller, bot, message, needsAssign[0])
    } else {
      bot.replyPublic(message, 'No current cases need assignment');
    }
  })
}