'use strict'

const RtmClient = require('@slack/client').RtmClient
const MemoryDataStore = require('@slack/client').MemoryDataStore
const RTM_EVENTS = require('@slack/client').RTM_EVENTS
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS

const token = ''

let slack = new RtmClient(token, {
  logLevel: 'debug', 
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoMark: true
})

slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  let user = slac.dataStore.getUserById(slac.activeUserId)
  let team = slack.dataStore.getTeamById(slack.activeTeamId)

  console.log(`Connected to ${team.name} as ${user.name}`)

})

slack.start()
