module.exports= function(controller){
  controller.on('channel_created', function(bot, message) {
    let channel = {
      'id': message.channel_id,
      'team_id': message.team_id
    }
    controller.storage.channels.save(channel, function(err, savedChannel) {
      if (!err) {
        console.log('Channel saved successfully')
      } else {
        console.log(`Channel ${message.channel_id} not persisted to data.`)
      }
    })
  })
}