const Botmock = require('botkit-mock');
const slashCommands = require('./slash_commands');

describe("slask_commands",()=>{
  afterEach(function () {
    this.controller.shutdown();
  });
  
  beforeEach(function () {
    this.userInfo = {
      slackId: 'user123',
      channel: 'channel123',
    };
    
    this.controller = Botmock({
      stats_optout: true,
      debug: false,
    });
    
    this.bot = this.controller.spawn({
      type: 'slack',
    });
    
    slashCommands(this.controller);
  });

  it("calls hello when the hello command is passed in", function() {
    var message = {
      text: "Some text",
      command: "/hello"
    }

    debugger;

    return this.bot.usersInput(this.buildSequence(messages)).then((message) => {
      return assert.equal(
        message.text,
        "hello there"
      );
    })
  });
});
