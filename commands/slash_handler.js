const success = require('./success')
const getFlags = require('./get_flags')
const logOut = require('./logout')
const flag = require('./flag')
const assign = require('./assign')
const nextCase = require('./next_case')
const cases = require('./cases')

const VERIFY_TOKEN = process.env.verificationToken

let publicMethods = module.exports = {}

publicMethods.mainHandler = function(controller, bot, message) {
  // Validate Slack verify token
  if (message.token !== VERIFY_TOKEN) {
    // Not sure how this isn't tripping up the tests
    // Lol maybe this works because they're both undefined?
    return bot.res.send(401, 'Unauthorized')
  }

  console.log('IN THE SLASH HANDLER')
  switch (message.command) {
    case '/hello':
      bot.replyPublic(message, 'hello there')
      break
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
      console.log('ABOUT TO CALL THE SUCCESS METHOD')
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
}