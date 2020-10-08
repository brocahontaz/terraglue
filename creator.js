import * as fs from 'fs'
import * as yaml from 'js-yaml'

export default class Creator {
  constructor (hosts, ssh, ansible, rke) {
    this.hosts = hosts
    this.ssh = ssh
    this.ansible = ansible
    this.rke = rke
  }

  createRKEClusterYaml () {
    this.hosts.forEach(host => {
      const rkeNode = _createRKENode(host)
      this.rke.nodes.push(rkeNode)
    })
    fs.writeFileSync(this.rke.configPath, yaml.safeDump(this.rke))
  }

  createAnsibleHosts () {
    console.log(this.ansible)

    let hostsFile = ''
    this.hosts.forEach(host => {
      hostsFile += host.name + '\n'
    })

    hostsFile += `
[all:vars]
docker_version="5:19.03.*"
    `

    fs.writeFileSync(this.ansible.hostsPath, hostsFile)
  }

  createSSHConfig () {
    let sshConfigFile = ''
    this.hosts.forEach(host => {
      sshConfigFile += `Host ${host.name}
HostName ${host.ip}
User ${host.user}

`
    })

    fs.writeFileSync(this.ssh.configPath, sshConfigFile)
  }
}

/**
 * @param host
 */
function _createRKENode (host) {
  const rkeNode = {
    address: host.ip,
    internal_address: host.internal_address,
    role: host.isMaster ? ['controlplane', 'etcd'] : ['worker'],
    labels: host.isMaster ? {
      'node-role.kubernetes.io/master': true
    } : '',
    taints: host.isMaster ? [{
      key: 'node-role.kubernetes.io/master',
      value: true,
      effect: 'NoSchedule'
    }] : [],
    hostname_override: host.name,
    user: host.user
  }

  return rkeNode
}
