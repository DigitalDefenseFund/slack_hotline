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

module.exports= function(controller){

  controller.hears(['([0-9]{5})'], 'ambient', function(bot, message) {
		zipCode  = message.match[1]
		console.log("detected zip: " + zipCode)
		controller.storage.clinics.find({'zip': zipCode}, function(error, clinics){
			console.log("found clinics: " + JSON.stringify(clinics))
			console.log(messageBuilder(zipCode, clinics))
			bot.replyPublic(message, messageBuilder(zipCode, clinics))
		})
  });

}; //module.export
