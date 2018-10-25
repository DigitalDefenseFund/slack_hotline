module.exports= function(controller){
  controller.on('channel_created', function(bot, message) {
    console.log('MESSAGE', message)
    let channel = {
      'id': message.channel_id,
      'team_id': message.team_id
    }
    controller.storage.channels.save(channel, function(err, savedChannel) {
      if (err) {
        // TODO https://trello.com/c/z8nCUqyZ/63-set-up-error-logging-in-production
        // should throw and log an error here if there's an error saving the channel
        console.log(`Channel ${message.channel_id} not persisted to data.`)
      }
    })
  })
}