const success = require('./success')
const getFlags = require('./get_flags')
const logOut = require('./logout')
const flag = require('./flag')
const assign = require('./assign')
const nextCase = require('./next_case')
const shared = require('./shared')

const VERIFY_TOKEN = process.env.verificationToken

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function friendlyDate(date) {
  return (staticSpaces(date.getMonth() + 1, 2, true) + "/"
         + staticSpaces(date.getDate(), 2) + " " 
         + staticSpaces(addZero(date.getHours()), 2, true) + ':'
         + addZero(date.getMinutes())
         );
}

function staticSpaces(string, targetLength, atBeginning) {
  var lead = Array(Math.max(0, targetLength - String(string).length)).join(' ')
  return (atBeginning ? (lead + string) : (string + lead) );
}

function tableFormat(channelList) {
  var formattedList = channelList.map(function(chan) {
    if (chan.store && chan.store.assignment) {
      var assignee = "<@" + chan.store.assignment+ ">"
    } else {
      var assignee = ""
    }
    return (staticSpaces((chan.lastFrom || ''), 11)
            + staticSpaces(chan.lastTime ? friendlyDate(chan.lastTime) : '', 15)
            + staticSpaces((chan.label || '' ),20)
            + staticSpaces((assignee),20)
            + "<#"+chan.id+">"
           );
  })
  var finalMessage = ('```' +"Open Cases:\n"
                      + staticSpaces('Last Message', 25) + staticSpaces("Flag",20) + staticSpaces("Assignee",20) + 'Channel\n'
                      + formattedList.join("\n") + '```');
  return finalMessage
}

function attachmentFormat(channelList) {
  var formattedList = channelList.map(function(chan) {
    // colors:
    // 1. assigned [green] #00f566
    // 2. patient last spoke [yellow] #f5c400
    // 3. needs attention [orange] #f35a00
    // 4. unassigned & patient last spoke [red] #f50056
    var color = '#00f566' // green
    if (chan.lastFrom === 'patient') {
      color = '#f5c400' //yellow
    }
    if (chan.label === 'needs attention') {
      color = '#f35a00' //orange
    }
    var assignee = ''
    if (chan.store && chan.store.assignment) {
      assignee = "<@" + chan.store.assignment+ ">"
    } else {
      color = '#f50056'
    }
    return {
      fields: [
        { title: ((chan.lastFrom || '')
                  + ' ' + (chan.lastTime ? friendlyDate(chan.lastTime) : '')
                  + (chan.label ? ' (' + chan.label + ')' : '')
                 ),
          value: (assignee || 'unassigned'),
          short: true
        }, {
          title: "Channel",
          value: "<#"+chan.id+">",
          short: true
        }
      ],
      color: color
    }
  })
  return {
    attachments: formattedList
  }
}

function open_cases(controller, bot, message, formatter) {
  /* Should display something like this!
    CHANNEL              LAST_MESSAGE (sorted) FLAG
    #sk-foo-bar          vol 16:01 9/17 (new)  needs attention
    #sk-happy-bear       pat 12:56 9/16
    #sk-hopeful-panda    vol  9:00 9/17        minor

    Options on /opencases:
    /opencases new (just new ones)
    /opencases flag
   */
  shared.getTeamChannelsData(controller, bot, message, function(channelList) {
    var openChannelList = [];
    for (var i = 0; i < channelList.length; i++) {
      var channel = channelList[i];
      if (/^sk-/.test(channel.api.name)){
        var new_channel = channel.api.num_members == 1, // channels that only have 1 member in them are brand new - that member is the one integrated with Smooch.
            unanswered = (channel.lastFrom && channel.lastFrom == 'patient'), // patient was the last to respond
            inactive = (!channel.lastTime || (new Date() - channel.lastTime) > (60*60*24*1000*7)), // no activity for a week
            flagged = !!(channel.store && channel.store.label)
        if (!channel.api.is_archived ) {
        // if ((new_channel || unanswered || flagged || inactive) && !channel.is_archived ) {
          openChannelList.push(channel);
        }
      }
    }
    var finalMessage = "There are no open cases right now."
    if (openChannelList.length > 0) {
      finalMessage = formatter(openChannelList)
    }
    bot.replyPublic(message, finalMessage)
  });
}

let publicMethods = module.exports = {}

publicMethods.mainHandler = function(controller, bot, message) {
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
    case '/cases':
      // list all the cases
      open_cases(controller, bot, message, tableFormat);
      break;
    case '/cases_pretty':
      // list all the cases
      open_cases(controller, bot, message, attachmentFormat);
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
}