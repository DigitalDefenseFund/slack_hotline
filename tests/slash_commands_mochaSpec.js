const assert = require('assert');
const Botmock = require('botkit-mock');
const slashCommands = require('../skills/slash_commands');

describe("slash_commands",()=>{
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
  });

  it("calls hello when the hello command is passed in", function() {
    var messages = [{
      text: "Some text",
      command: "/hello",
      isAssertion: true
    }];

    this.buildSequence = function (messages) {
      return [
        {
          type: 'direct_message', // probs need to change this but idk to what
          user: this.userInfo.slackId, //user required for each direct message
          channel: this.userInfo.channel, // user channel required for direct message
          messages: messages
        }
      ];
    };



    // console.log("before calling this.bot.usersInput...")
    var seq = this.buildSequence(messages);
    // console.log("BUILD SEQUENCE", seq);
    slashCommands(this.controller);
    return this.bot.usersInput(seq).then((message) => {
      return assert.equal(
        message.text,
        "hello there"
      );
    })
  });
});