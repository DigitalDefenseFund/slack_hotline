const VERIFY_TOKEN = process.env.verificationToken


function friendlyDate(date) {
  return (staticSpaces(date.getMonth() + 1, 2, true) + "/"
         + date.getDate() + " "
         + staticSpaces(date.getHours(), 2, true) + ':'
         + date.getMinutes());
}

function staticSpaces(string, targetLength, atBeginning) {
  var lead = Array(Math.max(0, targetLength - String(string).length)).join(' ')
  return (atBeginning ? (lead + string) : (string + lead) );
}

function get_channel_history(channel, bot, cb) {
  // https://github.com/howdyai/botkit/issues/840 : overwriting bot_token with app_token
  bot.api.channels.history({token: bot.config.bot.app_token,
                            channel: channel.id,
                            count: 30,
                            unreads: true},
                            cb);
}

function channelSummary(channel, history, flags) {
  // returns {lastFrom: ('patient'|'volunteer'),
  //          lastTime: Date(last_message)
  //          volunteer: <volunteer handle>
  //         }
  // assumes history is in reverse chronological order
  var summary = {'id': channel.id,
                 'name': channel.name
                };
  if (flags && flags.label) {
    summary.label = flags.label
  }
  if (history && history.messages) {
    for (var i=0,l=history.messages.length; i<l; i++) {
      var h = history.messages[i];
      if (h.subtype === 'bot_message') {
        if (/replied/.test(h.username)) {
          summary.lastFrom = 'volunteer'
          summary.volunteer = h.username.replace(' replied', '')
        } else if (h.attachments && /\/sk/.test((h.attachments[0]||{}).text || '')) {
          summary.lastFrom = 'patient'
        }
        if (summary.lastFrom) {
          summary.lastTime = new Date(Number(h.ts) * 1000)
          return summary
        }
      }
    }
  }
  return summary
}

function getTeamChannelsData(controller, bot, message, cb) {
  bot.api.channels.list({},function(err,response) {
    // console.log(message)
    getFlags(controller, bot, message, function(flagErr, knownChannelDict) {
      var numChannels = response.channels.length;
      var historiesTodo = numChannels;
      var histories = {}
      response.channels.map(function(ch) {
        get_channel_history(ch, bot, function(historyErr, chHistory) {
          if (!historyErr) {
            histories[ch.id] = chHistory;
          }
          --historiesTodo;
          // Here we have marshalled all the histories, and now we can
          // show the status for each
          if (historiesTodo <= 0) {
            // console.log('ALL HISTORIES', histories)
            // console.log('ALL FLAGS', knownChannelDict)
            var returnValue = response.channels.map(function(ch){
              var history = histories[ch.id]
              var store = knownChannelDict[ch.id]
              var summary = channelSummary(ch, history, store)
              summary.api = ch
              summary.history = history
              summary.store = store
              return summary
            })
            cb(returnValue)
          }
        })
      })
    })
  })
}


function open_cases(controller, bot, message) {
  /* Should display something like this!
    CHANNEL              LAST_MESSAGE (sorted) FLAG
    #sk-foo-bar          vol 16:01 9/17 (new)  needs attention
    #sk-happy-bear       pat 12:56 9/16
    #sk-hopeful-panda    vol  9:00 9/17        minor

    Options on /opencases:
    /opencases new (just new ones)
    /opencases flag
   */
  getTeamChannelsData(controller, bot, message, function(channelList) {
    var channel_list = [];
    for (var i = 0; i < channelList.length; i++) {
      var channel = channelList[i];
      if (/^sk-/.test(channel.api.name)){
        var new_channel = channel.api.num_members == 1, // channels that only have 1 member in them are brand new - that member is the one integrated with Smooch.
            unanswered = (channel.lastFrom && channel.lastFrom == 'patient'), // patient was the last to respond
            inactive = (!channel.lastTime || (new Date() - channel.lastTime) > (60*60*24*1000)), // TODO: LISA no activity for X amt of time
            flagged = !!(channel.store && channel.store.label)
                  // console.log(knownChannelDict[channel.id])
        if (!channel.is_archived ) {
        // if ((new_channel || unanswered || flagged || inactive) && !channel.is_archived ) {
          channel_list.push(channel);
        }
      }
    }

    if (channel_list.length > 0) {
      var formatted_list = channel_list.map(function(chan){
        return (staticSpaces("<#"+chan.id+">", 30)
               + staticSpaces((chan.lastFrom || ''), 10)
               + staticSpaces(chan.lastTime ? friendlyDate(chan.lastTime) : '', 13)
               + (chan.label || '' )
               );
      }),
      final_message = ("Open Cases:\n"
                       + "__Channel_________________Last Message_______Flag\n"
                       + formatted_list.join("\n"));
    } else {
      var final_message = "There are no open cases right now.";
    }
    bot.replyPublic(message, final_message);
  });
}

function setCaseAssignment(controller, message, channel, volunteer, cb) {
  setChannelProperty(controller, message, 'assignment', volunteer, function(err, chan) {
    cb(err, chan)
  }, (channel && channel.id))
}

function assign_case(controller, bot, message) {
  var volunteer = (message.text.match(/\<\@(\w+)/) || [message.user_id]).pop()
  setCaseAssignment(controller, message, null, volunteer, function(err, chan) {
    if (chan) {
      bot.replyPublic(message, '<@'+volunteer+'> assigned to <#'+chan.id+'>')
    }
  });
}

function next_case(controller, bot, message) {
}

function flag(controller, bot, message) {
  // console.log('FLAG', message)
  var label = message.text.replace(/.*>/,'').trim()
  if (!label) {
    label = 'needs attention'
  }
  if (message.command == '/unflag') {
    label = null
  }
  setChannelProperty(
    controller, message,
    'label', label,
    function(err, chan) {
      bot.replyPublic(message, message.command.slice(1) + 'ged')
    })
}

function setChannelProperty(controller, message, property, value, cb, channel_id) {
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
      // console.log('saved', err, d, channel)
      cb(storeErr, channel)
    })
  })
}

function getFlags(controller, bot, message, cb) {
  controller.storage.channels.all(function(err, channels) {
    var channelDict = {}
    if (!err && channels) {
      channels.map(function(c) {
        // must be in same team
        // console.log('channel', c)
        if (c.team_id == message.team_id) {
          channelDict[c.id] = c
        }
      })
    }
    cb(err, channelDict)
  })
}

function logOut(controller, bot, message){
	let user = message.user_id
	console.log(user)
	var userChannels = []
	bot.api.channels.list({token:bot.config.token}, function(err,response){
		response.channels.forEach((item) => {
			if(item.members.includes(user)){
				userChannels.push(item.id)
				console.log("channels: "+ userChannels)
			}
		 })
		 userChannels.forEach((channel)=> {
			 bot.api.channels.leave({token:bot.config.bot.app_token, channel: channel, user: user}, function(err,response){
				 console.log(err, response)
			 })
		 })
		 bot.replyPublic(message, 'You have logged out! Thank you so much for volunteering your time - you are so appreciated!')
	})
}


function flag(controller, bot, message) {
  // console.log('FLAG', message)
  var label = message.text.replace(/.*>/,'').trim()
  if (!label) {
    label = 'needs attention'
  }
  if (message.command == '/unflag') {
    label = null
  }
  setChannelProperty(
    controller, message,
    'label', label,
    function(err, chan) {
      bot.replyPublic(message, message.command.slice(1) + 'ged')
    })
}

function success(controller, bot, message){

	var label;
	if(!label){
		label = 'successful'
	}

	setChannelProperty(controller, message, 'success', label, function(err, chan){

		console.log(chan)
		bot.replyPublic('You have successfully archived this channel.')

		bot.api.channels.archive({token:bot.config.bot.app_token, channel: chan.id}, function(err, response){
			console.log(err, response)
		})
	})
}

module.exports= function(controller){

  controller.on('slash_command', function (bot, message) {
    // Validate Slack verify token
    if (message.token !== VERIFY_TOKEN) {
      return bot.res.send(401, 'Unauthorized')
    }
    switch (message.command) {
      case '/hello':
        bot.replyPublic(message, 'hello there')
        break
      case '/opencases':
        open_cases(controller, bot, message);
        break;
      case '/nextcase':
        next_case(controller, bot, message);
        break;
      case '/assign':
        assign_case(controller, bot, message);
        break;
      case '/flag':
      case '/unflag':
        flag(controller, bot, message)
        break
      case '/getflags':
        getFlags(controller, bot, message)
        break
      case '/success':
        success(controller, bot, message)
        break
			case '/logout':
				logOut(controller, bot, message)
				break
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })

}; //module.export
