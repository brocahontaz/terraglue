// import * as path from 'path'
import * as fs from 'fs'

export default class Parser {
  constructor (tfstatePath) {
    _validateArg(tfstatePath)
    this.tfstatePath = tfstatePath
    /*
    const splitPath = tfstatePath.split('/').filter(el => el !== '')
    splitPath[0] = '/' + splitPath[0]
    this.tfstatePath = path.join.apply(null, splitPath)
    */
    this.tfStateFile = fs.readFileSync(this.tfstatePath).toString()
    this.tfState = JSON.parse(this.tfStateFile)
    this.allInstances = _getInstances(this.tfState)
    this.AllFloatingIPAssociations = _getFloatingIPAssociations(this.tfState)
  }

  getAllInstances () {
    return this.allInstances
  }

  getNamedInstances (name) {
    return _getNamedInstances(this.allInstances, name)
  }

  getAllFloatingIpAssociations () {
    return this.AllFloatingIPAssociations
  }

  getIPByInstanceName (name) {
    return _getNamedIPs(this.AllFloatingIPAssociations, name)
  }

  getNodeInfo (nodes) {
    const parsedHosts = []
    nodes.forEach(node => {
      const instances = this.getNamedInstances(node.name)
      const instanceIPs = this.getIPByInstanceName(node.name)
      instances.forEach(instance => {
        const ip = instanceIPs.filter(ip => ip.attributes.instance_id === instance.attributes.id)[0].attributes.floating_ip
        parsedHosts.push({
          name: instance.attributes.name,
          user: node.user,
          ip: ip,
          isMaster: node.isMaster,
          internalAddress: instance.attributes.access_ip_v4
        })
      })
    })
    return parsedHosts
  }
}

/**
 * @param arg
 */
function _validateArg (arg) {
  if (!arg || typeof arg !== 'string' || arg === '') {
    throw new Error('Input argument must be a valid path written as a String!')
  }
}

/**
 * @param tfState
 */
function _getInstances (tfState) {
  return tfState.resources.filter(element => element.type === 'openstack_compute_instance_v2')
}

/**
 * @param instances
 * @param name
 */
function _getNamedInstances (instances, name) {
  return instances.filter(instance => instance.name === name)[0].instances
}

/**
 * @param tfState
 */
function _getFloatingIPAssociations (tfState) {
  return tfState.resources.filter(element => element.type === 'openstack_compute_floatingip_associate_v2')
}

/**
 * @param floatingIPAssociations
 * @param name
 */
function _getNamedIPs (floatingIPAssociations, name) {
  return floatingIPAssociations.filter(instance => instance.name === name)[0].instances
}

/**
 * @param node
 */
function _getNodeInfo (node) {

}
