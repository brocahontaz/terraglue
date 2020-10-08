import Parser from './parser.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const config = require('./config.json')
// import Creator from './creator'
try {
  const parser = new Parser(config.path)
  parser.getNodeInfo(config.nodeTypes[0])
  parser.getNodeInfo(config.nodeTypes[1])
} catch (err) {
  console.log(err)
}
