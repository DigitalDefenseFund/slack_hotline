module.exports= function(controller){
  controller.on('channel_created', function(bot, message) {
    let channel = {
      'id': message.channel_id,
      'team_id': message.team_id
    }
    controller.storage.channels.save(channel, function(err, savedChannel) {
      if (err) {
        // Do we want to throw an error here?
        // Or do we want to log an error here?
        // Should set up some error logging like Sentry
        console.log(`Channel ${message.channel_id} not persisted to data.`)
      }
    })
  })
}