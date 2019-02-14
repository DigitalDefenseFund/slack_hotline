let sharedFunctions = module.exports

sharedFunctions.setChannelProperty = function(controller, message, property, value, channel_id, cb) {
	channel_id = channel_id || (message.text.match(/\<\#(\w+)/) || [message.channel]).pop()
	controller.storage.channels.get(channel_id, function(getErr, channel) {
		if (!channel) {
			// if db returned null channel, it means something went wrong
			// so we let calling function deal with it
			cb(getErr, channel)
		} else { 
			// if we want to update with a null value, we want to delete the property
			// instead of null setting
			if (value === null) {
				delete channel[property]
			} else {
				channel[property] = value
			}
			controller.storage.channels.save(channel, function(storeErr, savedChannel){
				cb(storeErr, channel)
			})
		}
	})
}

sharedFunctions.getTeamChannelsData = function(controller, bot, message, cb) {
	// could break out this callback into a separate method so can stub out the return value of bot.api.channels.list ?
	bot.api.channels.list({},function(err,response) {
		getKnownChannels(controller, bot, message, function(flagErr, knownChannelDict) {
			var historiesTodo = response.channels.length;
			var histories = {}
			response.channels.map(function(ch) {
				getChannelHistory(ch, bot, function(historyErr, chHistory) {
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

function getKnownChannels(controller, bot, message, cb) {
	var sendbackTeamChannels = function(err, channels) {
		// This allows us to set the default count for a given flag to 0
		var channelDict = {}

		if (!err && channels) {
			channels.map(function(c) {
				// This conditional may seem redundant for .find() cases
				// but see AUDIT note below
				if (c.team_id == message.team_id) {
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

function getChannelHistory(channel, bot, cb) {
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
					// TODO -- remove the below line... pretty sure we don't use the summary.volunteer
					summary.volunteer = h.username.replace(' replied', '')
				} else if (h.attachments && /\/sk/.test((h.attachments[0]||{}).text || '')) {
					summary.lastFrom = 'patient'
				}
				if (summary.lastFrom) {
					summary.lastTime = new Date(Number(h.ts) * 1000)
					// Should the below line be outside of this if? It would only return the
					// summary if there's a lastFrom?
					return summary
				}
			}
		}
	}
	return summary
}
