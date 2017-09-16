// const VERIFY_TOKEN = process.env.verificationToken

  controller.on('slash_command', function (bot, message) {
    // Validate Slack verify token
    // if (message.token !== VERIFY_TOKEN) {
    //   return bot.res.send(401, 'Unauthorized')
    // }
    console.log(message)
    switch (message.command) {
      case '/hello':
        bot.replyPublic(message, 'hello there')
        break
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })

}; //module.export
