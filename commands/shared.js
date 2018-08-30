let sharedFunctions = module.exports

sharedFunctions.setChannelProperty = function(controller, message, property, value, cb, channel_id) {
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