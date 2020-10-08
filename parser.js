import * as path from 'path'
import * as fs from 'fs'

export default class Parser {
  constructor (tfStatePath) {
    _validateArg(tfStatePath)
    const splitPath = tfStatePath.split('/').filter(el => el !== '')
    splitPath[0] = '/' + splitPath[0]
    this.tfStatePath = path.join.apply(null, splitPath)
    this.tfStateFile = fs.readFileSync(this.tfStatePath).toString()
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
    _getNamedIPs(this.AllFloatingIPAssociations, name)
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
