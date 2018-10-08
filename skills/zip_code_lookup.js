module.exports= function(controller){

  controller.hears(['([0-9]{5})'], 'ambient', function(bot, message) {
		reply = message.match[1]
		bot.reply(message, reply)
  });

}; //module.export
