const fs = require('fs')
let configFile

const setFile = file => {
  configFile =  require('./' + file)
  console.log(configFile)
  //readFile = fs.readFileSync(file)
  //console.log(readFile)
}

const parseServers = servers => {

}

const parseRKE = () => {

}

const parseSSH = () => {

}

const parseAnsible = () => {

}

module.exports = {
  setFile,
  parseServers,
  parseRKE,
  parseSSH,
  parseAnsible
}