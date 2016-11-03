'use strict'
const {helpers} = require('./helpers/index.js')

const RtmClient = require('@slack/client').RtmClient
const MemoryDataStore = require('@slack/client').MemoryDataStore
const RTM_EVENTS = require('@slack/client').RTM_EVENTS
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS

const token = process.env.SLACK_TOKEN

let slack = new RtmClient(token, {
  logLevel: 'error', 
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoMark: true
})

// slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
//   let user = slack.dataStore.getUserById(slack.activeUserId)
//   let team = slack.dataStore.getTeamById(slack.activeTeamId)

//   console.log(`Connected to ${team.name} as ${user.name}`)

//   let groups = helpers.getGroups(slack.dataStore.groups)
//   let groupNames = groups.map((group) => {
//     return group.name
//   }).join(', ')

//   let channels = helpers.getGroups(slack.dataStore.channels)
//   let channelNames = channels.map((channel) => {
//     return channel.name
//   }).join(', ')

//   console.log(`Currently in groups: ${groupNames}`)
//   console.log(`Currently in channels: ${channelNames}`)

//   groups.forEach((group) => {
//     let members = group.members.map((id) => {
//       return slack.dataStore.getUserById(id)
//     })

//     members = members.filter((member) => {
//       return !member.is_bot
//     })

//     let memberNames = members.map((member) => {
//       return member.name
//     }).join(', ')
//     console.log(`Members of '${group.name}' channel: ${memberNames}`)

//     slack.sendMessage(`Hello ${memberNames}!`, group.id)

//   })


// })

slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

slack.on(RTM_EVENTS.MESSAGE, (message) => {
  let user = slack.dataStore.getUserById(message.user)

  if (user && user.is_bot) {
    return
  }

  let channel = slack.dataStore.getChannelGroupOrDMById(message.channel)

  if (message.text) {
    let msg = message.text.toLowerCase()

    if (/(hello|hi) (bot|awesomebot)/g.test(msg)) {
      slack.sendMessage(`Hello to you too, ${user.name}!`, channel.id)
    }
    if(/uptime/g.test(msg)) {
      let dm = slack.dataStore.getDMByName(user.name)
      let uptime = process.uptime()
      let minutes = parseInt(uptime / 60, 10)
      let hours = parseInt(minutes / 60, 10)
      let seconds = parseInt(uptime - (minutes * 60) - ((hours * 60) * 60), 10)

      slack.sendMessage(`I have been running for: ${hours} hours, ${minutes} minutes and ${seconds} seconds.`, dm.id)
    }
  }
})

slack.start()
