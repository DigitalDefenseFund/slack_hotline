const shared = require('./shared')

const findClinic = module.exports = {}

findClinic.call = function(controller, bot, message) {
	zipCodeMatch = message.text.match('([0-9]{5})')

	if(zipCodeMatch){
		zipCode = zipCodeMatch[1]
		controller.storage.clinics.find({'zip': zipCode}, function(error, clinics){
			bot.replyPublic(message, messageBuilder(zipCode, clinics))
		})
	} else {
		bot.replyPublic(message, 'Please submit a zip code with /find_clinic to get nearby clinics')
	}
}

function messageBuilder(zipCode, clinicList){
	message = '```We found the following clinics at zip code ' + zipCode + '\n\n'
	for(var i = 0; i < clinicList.length; i++){
		message += clinicList[i].name + '\n'
		message += clinicList[i].address + '\n'
		message += clinicList[i].phone + '\n'
		message += clinicList[i].hours + '\n'
		message += '\n'
	}
	message += '```'
	return message
}

