const fs = require('fs')
const os = require('os')
const path = require('path')
let configFile
let tfstateFile
let parsedtfstate
let serverTypes
let floatingIPAssociations

const setFile = file => {
  configFile = require('./' + file)
  tfstateFile = fs.readFileSync(getPath(configFile.tfstatePath)).toString()
  parsedtfstate = JSON.parse(tfstateFile)
  serverTypes = getServerTypes()
  floatingIPAssociations = getFloatingIPAssociations()
}

const parseServers = () => {
  return getAllInstances()
}

const parseSSHPath = () => {
  return getPath(configFile.ssh.configPath)
}

const parseRKEPath = () => {
  return getPath(configFile.rke.configPath)
}

const parseAnsiblePath = () => {
  return getPath(configFile.ansible.hostsPath)
}

const parseRKETemplate = () => {
  return configFile.rke.config
}

const getServerTypes = () => {
  return parsedtfstate.resources.filter(element => element.type === 'openstack_compute_instance_v2')
}

const getAdditionalServerTypeInfo = serverType => {
  return configFile.serverTypes[serverType]
}

const getFloatingIPAssociations = () => {
  return parsedtfstate.resources.filter(element => element.type === 'openstack_compute_floatingip_associate_v2')
}

const getAllInstances = () => {
  const parsedHosts = []
  let bastionHost = {}
  serverTypes.forEach(serverType => {
    const instances = getInstancesByType(serverType.name)
    const instanceIPs = getInstanceIPsByType(serverType.name)
    const additionalConfigInfo = getAdditionalServerTypeInfo(serverType.name)

    instances.forEach(instance => {
      const ip = getIPByAssociation(instanceIPs, instance.attributes.id)
      const host = {
        name: instance.attributes.name,
        user: additionalConfigInfo.user,
        ip: ip,
        isMaster: additionalConfigInfo.isMaster,
        isMonitor: additionalConfigInfo.isMonitor,
        isBastionHost: additionalConfigInfo.isBastionHost,
        isBuildServer: additionalConfigInfo.isBuildServer,
        internalAddress: instance.attributes.access_ip_v4
      }
      parsedHosts.push(host)
      if (additionalConfigInfo.isBastionHost) {
        bastionHost = host
      }
    })
  })
  return {bastionHost, parsedHosts}
}

const getInstancesByType = type => {
  return serverTypes.filter(instance => instance.name === type)[0].instances
}

const getInstanceIPsByType = type => {
  const filteredInstances = floatingIPAssociations.filter(instance => instance.name === type)[0]
  return filteredInstances?.instances || []
}

const getIPByAssociation = (instanceIPs, id) => {
  const ip = instanceIPs.filter(ip => ip.attributes.instance_id === id)[0]
  return ip?.attributes.floating_ip || undefined
}

const getPath = tildyPath => {
  const splitPath = tildyPath.split(path.sep)
  untildify(splitPath)
  return path.join.apply(null, splitPath)
}

const untildify = splitPath => {
  if (splitPath[0] === '~') {
    splitPath[0] = os.homedir()
  }
}

module.exports = {
  setFile,
  parseSSHPath,
  parseRKEPath,
  parseAnsiblePath,
  parseRKETemplate,
  parseServers
}