const fs = require('fs')
const os = require('os')
const path = require('path')
let configFile
let tfstateFile

const setFile = file => {
  configFile = require('./' + file)
  console.log(configFile.tfstatePath)
  tfstateFile = fs.readFileSync(getPath(configFile.tfstatePath)).toString()
  console.log(tfstateFile)
}

const parseServers = servers => {

}

const parseRKE = () => {

}

const parseSSH = () => {

}

const parseAnsible = () => {

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
  parseServers,
  parseRKE,
  parseSSH,
  parseAnsible
}