const backpop = module.exports = {}

backpop.call = function(controller, bot, teamID) {
  bot.api.channels.list({}, (err, response)=>{
    if (response && response.channels) {
      response.channels.map((channel)=>{
        chanToSave = '';
        controller.storage.channels.get(channel.id, (err, chan)=>{
          if (!chan && isCase(channel)) {
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

            chanToSave = {
              "id":          channel.id,
              "name":        channel.name,
              "team_id":     teamID
            }
          } else {
            chanToSave = chan
          }
        })
        controller.storage.channels.save(chanToSave, (err, chan)=>{})
      })
    }
  })
}

function isCase(channel) {
  channel.name.startsWith('sk-')
}