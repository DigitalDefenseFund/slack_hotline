module.exports= function(controller){

  controller.hears(['^hello$'], 'ambient', function(bot, message) {
    bot.reply(message, "Hi there")
  });

}; //module.export
