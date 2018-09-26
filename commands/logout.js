const logOut = module.exports = {}

logOut.call = function(controller, bot, message) {
  let user = message.user_id

  var userChannels = []
  bot.api.channels.list({token:bot.config.token}, function(err,response){
    response.channels.forEach((item) => {
      if(item.members.includes(user)){
        userChannels.push(item.id)
      }
    })
    userChannels.forEach((channel)=> {
      bot.api.channels.leave({token:bot.config.bot.app_token, channel: channel, user: user}, function(err,response){
        // console.log(err, response)
      })
    })
    bot.replyPublic(message, 'You have logged out! Thank you so much for volunteering your time - you are so appreciated!')
  })
}