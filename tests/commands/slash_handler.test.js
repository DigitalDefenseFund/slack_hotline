const slashCommands = require('../../commands/slash_handler');

describe("slash_commands",()=>{
  let mockController = {}

  describe("/hello",()=>{
    let mockMessage = {
      command: "/hello",
      token: process.env.verificationToken
    }

    let mockBot = {
      replyPublic: function(){
        return 'replyPublic called'
      }
    }
    let botSpy = jest.spyOn(mockBot, 'replyPublic')

    it("returns hello when command is /hello",()=>{
      slashCommands(mockController, mockBot, mockMessage)
      expect(botSpy).toHaveBeenCalledWith(mockMessage, "hello there")
    })
  })

  // describe("/cases",()=>{
  //   let mockMessage = {
  //     command: "/cases"
  //   }

  //   it("returns cases when command is /cases",()=>{
  //     mockController.on('slack_command')
  //     expect(botSpy).toHaveBeenCalled
  //   })
  // })
})