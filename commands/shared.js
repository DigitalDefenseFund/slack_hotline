let sharedFunctions = module.exports

sharedFunctions.setChannelProperty = function(controller, message, property, value, channel_id, cb) {
  channel_id = channel_id || (message.text.match(/\<\#(\w+)/) || [message.channel_id]).pop()
  controller.storage.channels.get(channel_id, function(getErr, channel) {
    if (getErr || !channel) {
      channel = {
        'id': channel_id,
        'team_id': message.team_id
      }
    }
    if (value === null) {
      delete channel[property]
    } else {
      channel[property] = value
    }
    controller.storage.channels.save(channel, function(storeErr, d){
      cb(storeErr, channel)
    })
  })
}

sharedFunctions.getTeamChannelsData = function(controller, bot, message, cb) {
  bot.api.channels.list({},function(err,response) {
    getChannelsWithFlags(controller, bot, message, function(flagErr, knownChannelDict) {
      var historiesTodo = response.channels.length;
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

// Private Helpers

function getChannelsWithFlags(controller, bot, message, cb) {
  var sendbackTeamChannels = function(err, channels) {
    // This allows us to set the default count for a given flag to 0
    var channelDict = {}

    if (!err && channels) {
      channels.map(function(c) {
        // This conditional may seem redundant for .find() cases
        // but see AUDIT note below
        if (c.team_id == message.team_id && c.label) {
          channelDict[c.id] = c;
        }
      })
    }

    cb(err, channelDict);
  }
  var storageChannels = controller.storage.channels

  if (storageChannels.find) {
    // not all storage backends have find()
    // e.g. Mongodb has it, but redis does not
    storageChannels.find({team_id: message.team_id}, sendbackTeamChannels)
  } else {
    // AUDIT NOTE: This channels.all gets all channels across
    // all instances -- not just the team instance
    // however you'll see we filter on message.team_id matching above
    // so nothing leaks (efficiency may be another question).
    storageChannels.all(sendbackTeamChannels)
  }
}

// UNUSED

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