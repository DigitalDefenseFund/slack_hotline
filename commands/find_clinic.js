const shared = require('./shared')
const googleMaps = require('@google/maps')

googleMapsClient = googleMaps.createClient({
	key: process.env.google_geolocation_api_key
});

const findClinic = module.exports = {}

findClinic.call = function(controller, bot, message) {
	zipCodeMatch = message.text.match('([0-9]{5})')
	if( !zipCodeMatch ){
		replyText = '```Please submit a valid zip code with /find_clinic to get nearby clinics```'
		bot.replyPublic(message, replyText)
	} else {
		zipCode = zipCodeMatch[1]
		googleMapsClient.geocode({'address': zipCode}, function(error, response) {
			if (!error) {
				lat = response.json.results[0].geometry.location.lat;
				lng = response.json.results[0].geometry.location.lng;
				controller.storage.clinics.find(
					{
						'location': {
							'$near': {
								'$geometry': {
									'type': "Point" ,
									'coordinates': [ lng, lat]
								},
								'$maxDistance': 100000,
								'$minDistance': 0
							}
						}
					}, function(error, clinics){
						if(!error && clinics) {
							if(clinics.length == 0){
								replyText = '```No clinics found at that zip code```';
							} else {
								replyText = messageBuilder(zipCode, clinics)
							}
							bot.replyPublic(message, replyText)
						}
					})
			} else {
				console.log("Geocode failed: " + error);
				replyText = '```Please submit a valid zip code with /find_clinic to get nearby clinics```'
				bot.replyPublic(message, replyText)
			}
		})
	}
}

function messageBuilder(zipCode, clinicList){
	clinicList = clinicList.length > 5 ? clinicList.slice(0, 5) : clinicList
	let message = '```We found the following clinics near  zip code ' + zipCode + '\n\n'
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
