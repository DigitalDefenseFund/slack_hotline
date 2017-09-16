module.exports= function(controller){
  console.log("this is being called on join");
  controller.on('user_channel_join',function(bot,message) {
    console.log("here usr: " + message.user)
  });
};
