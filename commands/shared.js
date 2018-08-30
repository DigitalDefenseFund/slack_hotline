let sharedFunctions = module.exports

sharedFunctions.setChannelProperty = function(controller, message, property, value, cb, channel_id) {
  channel_id = channel_id || (message.text.match(/\<\#(\w+)/) || [message.channel_id]).pop()
  controller.storage.channels.get(channel_id, function(getErr, channel) {
    if (getErr || !channel) {
      channel = {'id': channel_id,
                 'team_id': message.team_id
                }
    }
    if (value === null) {
      delete channel[property]
    } else {
      channel[property] = value
    }
    controller.storage.channels.save(channel, function(storeErr, d){
      cb(storeErr, channel)
    })
  })
}