const success = require('../commands/success')
const getFlags = require('../commands/get_flags')
const logOut = require('../commands/logout')
const flag = require('../commands/flag')
const assign = require('../commands/assign')
const nextCase = require('../commands/next_case')
const cases = require('../commands/cases')
const help = require('../commands/help')

const VERIFY_TOKEN = process.env.verificationToken

module.exports= function(controller){

  controller.on('slash_command', function(bot, message) {
    // Validate Slack verify token
    if (message.token !== VERIFY_TOKEN) {
      // Not sure how this isn't tripping up the tests
      // Lol maybe this works because they're both undefined?
      return bot.res.send(401, 'Unauthorized')
    }

    switch (message.command) {
      case '/hello':
        bot.replyPublic(message, 'hello there')
        break
      case '/helpme':
        help.call(bot, message);
        break;
      case '/cases':
        // list all the cases
        cases.call(controller, bot, message, 'normal');
        break;
      case '/cases_pretty':
        // list all the cases
        cases.call(controller, bot, message, 'pretty');
        break;
      case '/nextcase':
        // assign yourself the next case
        nextCase.call(controller, bot, message);
        break;
      case '/assign':
        // assign a volunteer to a particular channel
        assign.call(controller, bot, message);
        break;
      case '/flag':
      case '/unflag':
        // flag or unflag a particular channel (defaults to channel that you are in)
        flag.call(controller, bot, message)
        break
      case '/getflags':
        // list all the flags
        getFlags.call(controller, bot, message, function(err, flags) {
          bot.replyPrivate(message, flags)
        })
        break
      case '/success':
        // mark a channel as success (and closed)
        success.call(controller, bot, message)
        break
      case '/logout':
        // logs out and will make your cases available to other volunteers to pick up
        logOut.call(controller, bot, message)
        break
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })
}; //module.export
