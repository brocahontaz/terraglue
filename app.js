import Parser from './parser.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const config = require('./config.json')
// import Creator from './creator'
try {
  const parser = new Parser(config.path)
  console.log(parser.getNodeInfo(config.nodeTypes))
} catch (err) {
  console.log(err)
}
