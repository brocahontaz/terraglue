import { createRequire } from 'module'
import * as path from 'path'

import Parser from './parser.js'
import Creator from './creator.js'

const require = createRequire(import.meta.url)
const config = require('./config.json')

try {
  const parser = new Parser(_getPath(config.tfstatePath))
  console.log(parser.getNodeInfo(config.nodeTypes))
  const creator = new Creator(parser.getNodeInfo(config.nodeTypes))
  creator.createAnsibleHosts(_getPath(config.ansible.hostsPath))
} catch (err) {
  console.log(err)
}

/**
 * @param inputPath
 */
function _getPath (inputPath) {
  const splitPath = inputPath.split('/').filter(el => el !== '')
  splitPath[0] = '/' + splitPath[0]
  return path.join.apply(null, splitPath)
}
