const shared = require('./shared')

/*

Clinics are stored with the following fields.
All are strings.

- name
- address
- street
- street2
- city
- state
- zip
- lat
- lng
- distance
- description
- url
- hours
- phone
- fax
- email
- image
- tags

*/

const findClinic = module.exports = {}

findClinic.call = function(controller, bot, message) {
	zipCodeMatch = message.text.match('([0-9]{5})')
	let replyText = '';

	if(zipCodeMatch){
		zipCode = zipCodeMatch[1]
		controller.storage.clinics.find({'zip': zipCode}, function(error, clinics){
			if(!error && clinics) {
				if(clinics.length == 0){
					replyText = '```No clinics found at that zip code```';
				} else {
					replyText = messageBuilder(zipCode, clinics)
				}
			}
		})
	} else {
		replyText = '```Please submit a valid zip code with /find_clinic to get nearby clinics```'
	}

	bot.replyPublic(message, replyText)
}

function messageBuilder(zipCode, clinicList){
	let message = '```We found the following clinics at zip code ' + zipCode + '\n\n'
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

