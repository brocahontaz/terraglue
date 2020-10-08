import { createRequire } from 'module'
import * as path from 'path'

import Parser from './parser.js'
import Creator from './creator.js'

const require = createRequire(import.meta.url)
const config = require('./config.json')

try {
  const parser = new Parser(_getPath(config.tfstatePath))

  const creator = new Creator(parser.getNodeInfo(config.nodeTypes), config.ssh, config.ansible, config.rke.config)
  creator.createAnsibleHosts()
  creator.createSSHConfig()
  creator.createRKEClusterYaml()
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
