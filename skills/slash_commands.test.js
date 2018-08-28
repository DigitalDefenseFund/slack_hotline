const slashCommands = require('./slash_commands');

describe("slask_commands",()=>{
  const mockBot = {
    replyPublic: jest.fn(function(){
      return 'hello there'
    })
  }
  const mockMessage = {
    command: "/hello"
  }
  const mockController = {
    // on 'slash_command', it does the thing
    // on 'literally_anything_else', it doesn't trigger the callback?
    on: jest.fn(function(event_arg) {
      if (event_arg === 'slack_command') {
        return mockBot, mockMessage
      } else {
        return 'was not triggered'
      }
    }),
    testing: jest.fn(function(){
      return "hiya cats"
    })
  }

  const botSpy = jest.spyOn(mockBot, 'replyPublic')
  
  it("returns hello when command is /hello",()=>{
    mockController.on('slack_command');
    expect(botSpy).toHaveBeenCalled
  })
});
