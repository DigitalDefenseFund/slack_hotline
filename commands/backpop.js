const backpop = module.exports = {}

backpop.call = function(controller, bot, message, callback) {
  bot.api.channels.list({}, (err, response)=>{
    if (response && response.channels) {
      response.channels.map((channel)=>{
        // This is what the full channel returned from bot.api.channels.list
        // {
        //   "id":"C9YPNB9GE",
        //   "name":"sk-pretty-condor",
        //   "is_channel":true,
        //   "created":1522286159,
        //   "is_archived":true,
        //   "is_general":false,
        //   "unlinked":0,
        //   "creator":"U7GQZJDQT",
        //   "name_normalized":"sk-pretty-condor",
        //   "is_shared":false,
        //   "is_org_shared":false,
        //   "is_member":false,
        //   "is_private":false,
        //   "is_mpim":false,
        //   "members":[],
        //   "topic":{"value":"","creator":"","last_set":0},
        //   "purpose":{"value":"","creator":"","last_set":0},
        //   "previous_names":[],
        //   "num_members":0
        // }
        controller.storage.channels.get(channel.id, (err, chan)=>{
          if (!chan) {
            callback(controller, bot, message, channel)
          }
        })
      })
    }
  })
}

backpop.syncVerbose = function(controller, bot, message, channel) {
  bot.startPrivateConversation({user: message.user_id},function(err,convo) {
    if (err) {
      console.log(err);
    } else {
      if (isCase(channel)) {
        chanToSave = {
          "id":      channel.id,
          "name":    channel.name,
          "team_id": message.team_id
        }

        controller.storage.channels.save(chanToSave, (err, chan)=>{
          var msgText = '';
          if (err) {
            msgText = `Error saving ${chan.name}.`;
          } else {
            msgText = `Successfully synced ${chan.name} to the database.`
          }

          convo.say(msgText)
        })
      } else {
        convo.say(`Did not save ${channel.name} because it's not a case channel.`)
      }
    }
  })
}

backpop.syncSilent = function(controller, bot, message, channel) {
  if (isCase(channel)) {
    chanToSave = {
      "id":      channel.id,
      "name":    channel.name,
      "team_id": message.team_id
    }

    controller.storage.channels.save(chanToSave, (err, chan)=>{
      if (err) {
        console.log(`Error saving ${chan.name}.`);
      } else {
        console.log(`Successfully synced ${chan.name} to the database.`);
      }
    })
  } else {
    console.log(`Did not save ${channel.name} because it's not a case channel.`);
  }
}

function isCase(channel) {
  return channel.name.startsWith('sk-')
}