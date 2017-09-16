module.exports= function(controller){
  console.log("this is being called on leave");
  controller.on('user_channel_join',function(bot,message) {
    console.log("here usr: " + message.user)
  });
};
