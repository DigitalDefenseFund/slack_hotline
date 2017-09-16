module.exports= function(controller){
  controller.on('user_channel_join',function(bot,message) {
    console.log("here usr: " + message.user)
  });
};
