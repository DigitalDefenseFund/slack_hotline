const Botmock = require('botkit-mock')
const slashCommands = require('../../skills/slash_commands')

const db = require('monk')(process.env.MONGO_URI || process.env.MONGODB_URI)

LOCATIONS = {
  72110: [-92.7201903, 35.1674683],
  33322: [-35.1674683, 92.7201903]
}

jest.mock('@google/maps')

beforeAll(()=>{
  let sampleClinics = [
    {
      name: "Test Clinic",
      street: "1234 Main St",
      city: "Meowtown",
      state: "AR",
      zip: "72110",
      location: {
        type: 'Point',
        coordinates: [-92.7201903, 35.1674683]
      },
      contactInfo: "1800-YUMYUM M-F 9-5"
    }
  ]

  let clinics = db.get('clinics')
  clinics.createIndex({"location":"2dsphere"})

  clinics.insert(sampleClinics).then((insertedClinics)=>{
    console.log(`Inserted ${JSON.stringify(insertedClinics.length)} clinics`)
  }).catch((err)=>{
    console.log(err)
  }).then(() => {
    //db.close()
  })
})

afterAll(()=>{
  let clinics = db.get('clinics')
  clinics.remove({})
  db.close()
})

describe('find_clinic',()=>{

  let channels = [
    {
      "id":"sample_channel",
      "team_id":"team_id_123"
    }
  ]
  let sampleClinics = [
    {
      "name":"Test Clinic",
      "address":"1234 Main St",
      "phone": "1800-YUMYUM",
      "hours": "M-F 9-5"
    }
  ]
  beforeEach(()=>{
    this.controller = Botmock({});
    channels.map((channel)=>{
      this.controller.storage.channels.save(channel, function(){})
    })
    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }
    slashCommands(this.controller)
  });

  describe('When called with an non-geocodeable argument',()=>{
    it('returns usage text',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'sample_user',
          channel: 'sample_channel',
          messages: [
            {
              command: '/find_clinic',
              text: '',
              actions: [{
                name: 'action',
                value: 'test'
              }],
              isAssertion: true,
            }
          ]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toBe('```Please submit a valid zip code with /find_clinic to get nearby clinics```')
      })
    })
  })

  describe('When called with a zip code',()=>{
    describe('When clinics exist for that zip code',()=>{
      it('returns clinic info',()=>{
        this.sequence = [
          {
            type: 'slash_command',
            user: 'sample_user',
            channel: 'sample_channel',
            messages: [
              {
                user_id: 'sample_user',
                channel_id: 'sample_channel',
                command: '/find_clinic',
                text: '12345',
                actions: [{
                  name: 'action',
                  value: 'test'
                }],
                isAssertion: true,
              }
            ]
          }
        ];

        return this.bot.usersInput(this.sequence).then(() => {
          const reply = this.bot.api.logByKey['replyPublic'][0].json
          for(var i = 0; i < sampleClinics.length; i++){
            expect(reply.text).toContain(sampleClinics[0].name)
            expect(reply.text).toContain(sampleClinics[0].address)
            expect(reply.text).toContain(sampleClinics[0].phone)
            expect(reply.text).toContain(sampleClinics[0].hours)
          }
        })
      })
    })

    describe('When no clinics exist for that zip code',()=>{
      it('replies that no clinics were found',()=>{
        this.sequence = [
          {
            type: 'slash_command',
            user: 'sample_user',
            channel: 'sample_channel',
            messages: [
              {
                user_id: 'sample_user',
                channel_id: 'sample_channel',
                command: '/find_clinic',
                text: '12345',
                actions: [{
                  name: 'action',
                  value: 'test'
                }],
                isAssertion: true,
              }
            ]
          }
        ];

        return this.bot.usersInput(this.sequence).then(() => {
          const reply = this.bot.api.logByKey['replyPublic'][0].json;
          expect(reply.text).toBe('```No clinics found at that zip code```')
        })
      })
    })
  })
})