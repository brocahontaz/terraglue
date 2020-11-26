const fs = require('fs')
const yaml = require('js-yaml')

let bastion
let hosts

setInstances = instances => {
  bastion = instances.bastionHost
  hosts = instances.parsedHosts
}

const createRKE = () => {

}

const createSSH = () => {
  let sshConfigFile = ''
  hosts.forEach(host => {
    sshConfigFile += `Host ${host.name}\n`
    if (!host.ip) {
      sshConfigFile +=
      `ProxyJump ${bastion.name}\n` +
      `HostName ${host.internalAddress}\n`
    } else {
      sshConfigFile += `HostName ${host.ip}\n`
    }
    sshConfigFile += `User ${host.user}\n\n`
  })
  console.log(sshConfigFile)

  fs.writeFileSync()
}

const createAnsible = () => {

}

module.exports = {
  setInstances,
  createRKE,
  createSSH,
  createAnsible
}