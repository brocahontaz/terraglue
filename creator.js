import * as fs from 'fs'

export default class Creator {
  constructor (hosts) {
    this.hosts = hosts
  }

  createClusterYaml () {

  }

  createAnsibleHosts (hostsPath) {
    let hostsFile = ''
    this.hosts.forEach(host => {
      hostsFile += host.name + '\n'
    })

    fs.writeFileSync(hostsPath, hostsFile)
  }

  createSSHConfig () {

  }
}
