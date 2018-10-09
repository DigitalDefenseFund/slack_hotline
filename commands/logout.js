const logOut = module.exports = {}

logOut.call = function (controller, bot, message){
  console.log('IN LOGOUT CONTROLLER', controller)
  console.log('IN LOGOUT BOT', bot)
  console.log('IN LOGOUT MESSAGE', message)
  let user = message.user_id

  var userChannels = []
  bot.api.channels.list({token:bot.config.token}, function(err,response){
    response.channels.forEach((item) => {
      if(item.members.includes(user)){
        userChannels.push(item.id)
      }

      controller.storage.channels.get(item.id, function(err,channel){
        if(channel && channel.assignment && channel.assignment == user) {
          delete channel['assignment']
          controller.storage.channels.save(channel, function(storeErr, savedChannel){
            throw storeErr
            // console.log(storeErr, savedChannel)
          })
        }
      })
    })
    userChannels.forEach((channel)=> {
      bot.api.channels.leave({token:bot.config.bot.app_token, channel: channel, user: user}, function(err,response){
        // console.log(err, response)
      })
    })
    bot.replyPublic(message, 'You have logged out! Thank you so much for volunteering your time - you are so appreciated!')
  })
}