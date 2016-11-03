function getChannels(allChannels) {
  let channels = []

  for (let id in allChannels) {
    console.log(allChannels[id])
    let channel = allChannels[id]

    if (channel.is_member) {
      channels.push(channel)
    }
  }

  return channels
}

function getGroups(allGroups) {
  let groups = []

  for (let id in allGroups) {
    let group = allGroups[id]

    groups.push(group)
  }

  return groups
}

exports.helpers = {getChannels, getGroups}
