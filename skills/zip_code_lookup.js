module.exports= function(controller){

  controller.hears(['^[0-9]{5}'], 'ambient', function(bot, message) {
    bot.reply(message, "Hi there")
  });

}; //module.export
