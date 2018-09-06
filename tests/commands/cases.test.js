const Botmock = require('botkit-mock');
const cases = require('../../commands/cases')

describe("cases",()=>{
  let mockCtlr = {}
  let mockBot = {}
  let mockMsg = {}

  // channel obj from channel list
  let flaggedChannel = {
    id: 'CCJRX6SQ7',
    name: 'sk-flashy-bee',
    label: 'urgent',
    lastFrom: 'volunteer',
    volunteer: 'nicole',
    lastTime: '2018-08-29T21:59:24.000Z',
    api: { 
      id: 'CCJRX6SQ7',
      name: 'sk-flashy-bee',
      is_channel: true,
      created: 1535579938,
      is_archived: false,
      is_general: false,
      unlinked: 0,
      creator: 'UCBR5SE87',
      name_normalized: 'sk-flashy-bee',
      is_shared: false,
      is_org_shared: false,
      is_member: false,
      is_private: false,
      is_mpim: false,
      members: [Array],
      topic: [Object],
      purpose: [Object],
      previous_names: [],
      num_members: 1
    },
    history: { 
      ok: true,
      messages: [Array],
      has_more: false,
      unread_count_display: 0
    },
    store: {
      id: 'CCJRX6SQ7', team_id: 'T7H1WH329', label: 'urgent'
    }
  }

  let archivedChannel = {
    id: 'DDTYX6PO7',
    name: 'sk-sassy-bug',
    label: '',
    lastFrom: 'volunteer',
    volunteer: 'nicole',
    lastTime: '2018-08-29T21:59:24.000Z',
    api: { 
      id: 'DDTYX6PO7',
      name: 'sk-sassy-bug',
      is_channel: true,
      created: 1535579938,
      is_archived: true,
      is_general: false,
      unlinked: 0,
      creator: 'UCBR5SE87',
      name_normalized: 'sk-sassy-bug',
      is_shared: false,
      is_org_shared: false,
      is_member: false,
      is_private: false,
      is_mpim: false,
      members: [Array],
      topic: [Object],
      purpose: [Object],
      previous_names: [],
      num_members: 1
    },
    history: { 
      ok: true,
      messages: [Array],
      has_more: false,
      unread_count_display: 0
    }
  }

  let assignedChannel = {
    id: 'NMUPX6VC7',
    name: 'sk-seabass-cat',
    label: '',
    lastFrom: 'patient',
    volunteer: 'nicole',
    lastTime: '2018-08-29T21:59:24.000Z',
    api: { 
      id: 'NMUPX6VC7',
      name: 'sk-seabass-cat',
      is_channel: true,
      created: 1535579938,
      is_archived: false,
      is_general: false,
      unlinked: 0,
      creator: 'UCBR5SE87',
      name_normalized: 'sk-seabass-cat',
      is_shared: false,
      is_org_shared: false,
      is_member: false,
      is_private: false,
      is_mpim: false,
      members: [Array],
      topic: [Object],
      purpose: [Object],
      previous_names: [],
      num_members: 1
    },
    history: { 
      ok: true,
      messages: [Array],
      has_more: false,
      unread_count_display: 0
    },
    store: {
      id: 'NMUPX6VC7', team_id: 'T7H1WH329', assignment: 'UCBR5SE87'
    }
  }

  // final message
  let finalMsg = '```'
  finalMsg += ```Open Cases:
  Last Message            Flag               Assignee           Channel
  volunteer 8/21 23:33    more urgent                           <#CCCMUN3A7>
  volunteer 8/21 13:28                                          <#CCCP5GABX>
  volunteer 8/29 16:59    flashy bee                            <#CCJRX6SQ7>```
  finalMsg += '```'

  describe("When format is pretty",()=>{
    it("uses the attachment format",()=>{

    })

    // colors:
    // 1. assigned [green] #00f566
    // 2. patient last spoke [yellow] #f5c400
    // 3. needs attention [orange] #f35a00
    // 4. unassigned & patient last spoke [red] #f50056
  })

  describe("When format is NOT pretty",()=>{
    it("placeholder",()=>{})
  })
})