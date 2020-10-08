import * as fs from 'fs'

export default class Creator {
  constructor (hosts) {
    this.hosts = hosts
  }

  createRKEClusterYaml () {

  }

  createAnsibleHosts (hostsPath) {
    let hostsFile = ''
    this.hosts.forEach(host => {
      hostsFile += host.name + '\n'
    })

    hostsFile += `
[all:vars]
docker_version="5:19.03.*"
    `

    fs.writeFileSync(hostsPath, hostsFile)
  }

  createSSHConfig (configPath) {
    let sshConfigFile
    this.hosts.forEach(host => {
      sshConfigFile += `Host ${host.name}
      HostName ${host.ip}
      User debian
    
    `
    })

    fs.writeFileSync(configPath, sshConfigFile)
  }
}
