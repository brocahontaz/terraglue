const fs = require('fs')
const yaml = require('js-yaml')

let bastion
let hosts
let rkeTemplate

const setInstances = instances => {
  bastion = instances.bastionHost
  hosts = instances.parsedHosts
}

const setRKETemplate = template => {
  rkeTemplate = template
}

const createRKE = path => {
  let rkeConfig = rkeTemplate
  hosts.forEach(host => {
    if (host.isBastionHost) {
      rkeConfig.bastion_host = {
        address: host.ip,
        user: host.user,
        port: 22
      }
    }
    if (!host.isMonitor && !host.isBuildServer) {
      const clusterNode = createClusterNode(host)
      rkeConfig.nodes.push(clusterNode)
    }
  })

  fs.writeFileSync(path, yaml.safeDump(rkeConfig))
}

const createClusterNode = host => {
  const clusterNode = {
    address: host.ip ? host.ip : host.internalAddress,
    internal_address: host.internalAddress,
    role: host.isMaster ? ['controlplane', 'etcd'] : ['worker'],
    hostname_override: host.name,
    user: host.user
  }

  if (host.isMaster) {
    clusterNode.labels = { 'node-role.kubernetes.io/master': true }
    clusterNode.taints = [{
      key: 'node-role.kubernetes.io/master',
      value: true,
      effect: 'NoSchedule'
    }]
  }

  return clusterNode
}

const createSSH = path => {
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
  fs.writeFileSync(path, sshConfigFile)
}

const createAnsible = path => {
  let hostsFile = ''
  hosts.forEach(host => {
    hostsFile += host.name + '\n'
  })

  hostsFile += '\n[MonitoringServer]\n'
  hosts.filter(host => host.isMonitor).forEach(host => {
    hostsFile += `${host.name}`
  })

  hostsFile += '\n[BuildServer]\n'
  hosts.filter(host => host.isBuildServer).forEach(host => {
    hostsFile += `${host.name}`
  })

  hostsFile += `\n
[all:vars]
docker_version="5:19.03.*"`

  fs.writeFileSync(path, hostsFile)
}

module.exports = {
  setInstances,
  setRKETemplate,
  createRKE,
  createSSH,
  createAnsible
}