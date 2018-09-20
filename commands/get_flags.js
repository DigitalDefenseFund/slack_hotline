const getFlags = module.exports

getFlags.call = function(controller, bot, message, cb) {
  var sendbackTeamChannels = function(err, channels) {
    // This allows us to set the default count for a given flag to 0
    var flagDict =  new Proxy({}, {
                      get: function(object, property) {
                        return object.hasOwnProperty(property) ? object[property] : 0;
                      }
                    });
    if (!err && channels) {
      channels.map(function(c) {
        // This conditional may seem redundant for .find() cases
        // but see AUDIT note below
        if (c.team_id == message.team_id && c.label) {
          flagDict[c.label] += 1;
        }
      })
    }

    var finalMessage = flagFormatting(flagDict);

    cb(err, finalMessage);
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

function flagFormatting(flagCounts) {
  var formattedList = '```' +"All Flags:\n";

  for (var flag in flagCounts) {
    formattedList += flag;
    formattedList += "\n";
  }

  formattedList += '```';
  return formattedList
}