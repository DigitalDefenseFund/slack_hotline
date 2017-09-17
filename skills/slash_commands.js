const VERIFY_TOKEN = process.env.verificationToken

function get_channel_history(channel, bot, cb) {
  // https://github.com/howdyai/botkit/issues/840 : overwriting bot_token with app_token
  bot.api.channels.history({token: bot.config.bot.app_token,channel:channel.id, count:6,unreads:true}, cb);
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
  if (history) {
    for (var i=0,l=history.length; i<l; i++) {
      var h = history[i];
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
  bot.api.channels.list({},function(err,response) {
    console.log(message)
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
            console.log('ALL HISTORIES', histories)
            console.log('ALL FLAGS', knownChannelDict)
    var channel_list = [];
    for (var i = 0; i < numChannels; i++) {
      var channel = response.channels[i];
      if (/^sk-/.test(channel.name)){
        var summary = channelSummary(channel, histories[channel.id], knownChannelDict[channel.id])
        var new_channel = channel.num_members == 1, // channels that only have 1 member in them are brand new - that member is the one integrated with Smooch.
            unanswered = (summary.lastFrom && summary.lastFrom == 'patient'), // patient was the last to respond
            inactive = (!summary.lastTime || (new Date() - summary.lastTime) > (60*60*24*1000)), // TODO: LISA no activity for X amt of time
            flagged = !!(knownChannelDict[channel.id] && knownChannelDict[channel.id].label)
                  console.log(knownChannelDict[channel.id])
        if ((new_channel || unanswered || flagged || inactive) && !channel.is_archived ) {
          channel_list.push(summary);
        }
      }
    }
    if (channel_list.length > 0) {
      var formatted_list = channel_list.map(function(chan){
        return "<#"+chan.id+">    " + (chan.label || '');
      }),
          final_message = "Open Cases:\n" + formatted_list.join("\n");
    } else {
      var final_message = "There are no open cases right now.";
    }
    bot.replyPublic(message, final_message);
          }
        })
      })
    });
  });
}

function flag(controller, bot, message) {
  console.log('FLAG', message)
  var channel_id = (message.text.match(/\<\#(\w+)/) || [message.channel_id]).pop()
  var label = message.text.replace(/.*>/,'').trim()
  if (!label) {
    label = 'needs attention'
  }
  console.log('FLAG DATA', channel_id, label)
  console.log('BOT', bot)
  controller.storage.channels.get(channel_id, function(err, channel) {
    if (err || !channel) {
      channel = {'id': channel_id,
                 'team_id': message.team_id
                }
    }
    if (message.command == '/unflag') {
      delete channel.label
    } else {
      channel.label = label
    }
    controller.storage.channels.save(channel, function(err, d){
      console.log('saved', err, d, channel)
      bot.replyPublic(message, message.command.slice(1) + 'ged')
    })
  })
}

function getFlags(controller, bot, message, cb) {
  controller.storage.channels.all(function(err, channels) {
    var channelDict = {}
    if (!err && channels) {
      channels.map(function(c) {
        // must be in same team
        console.log('channel', c)
        if (c.team_id == message.team_id) {
          channelDict[c.id] = c
        }
      })
    }
    cb(err, channelDict)
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
      case '/flag':
      case '/unflag':
        flag(controller, bot, message)
        break
      case '/flags':
        getFlags(controller, bot, message)
        break
      default:
        bot.replyPublic(message, 'Sorry, I\'m not sure what that command is')
    }
  })

}; //module.export
