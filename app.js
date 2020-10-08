import Parser from './parser.js'
import { createRequire } from 'module'
import Creator from './creator'
const require = createRequire(import.meta.url)
const config = require('./config.json')
try {
  const parser = new Parser(config.tfstatePath)
  console.log(parser.getNodeInfo(config.nodeTypes))
  const creator = new Creator(parser.getNodeInfo(config.nodeTypes))
  creator.createAnsibleHosts(config.ansible.hostsPath)
} catch (err) {
  console.log(err)
}
