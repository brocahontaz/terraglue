const path = require('path')
const yargs = require('yargs')
const os = require('os')
const colors = require('colors')

const Parser = require('./parser')
const Creator = require('./creator')

const argv = yargs
  .command('$0 <file>', 'The config file', {
    file: {
      description: 'The config file to read values from.',
      type: 'json'
    }
  })
  .option('rke', {
    alias: 'r',
    description: 'Create config file for rke',
    type: 'boolean' 
  })
  .option('ansible', {
    alias: 'a',
    description: 'Create config files for Ansible',
    type: 'boolean'
  })
  .option('ssh', {
    alias: 's',
    description: 'Create SSH host file',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h')
  .argv

Parser.setFile(argv.file)

const servers = Parser.parseServers()

Creator.setInstances(servers)

if (argv.ssh) {
  console.log('~~~Creating SSH config file~~~'.bold)
  Creator.createSSH(Parser.parseSSHPath())
  console.log('>SSH config file created!<\n'.bold)
}

if (argv.ansible) {
  console.log('~~~Creating Ansible hosts file~~~'.bold)
  Creator.createAnsible(Parser.parseAnsiblePath())
  console.log('>Ansible hosts file created!<\n'.bold)
}

if (argv.rke) {
  console.log('~~~Creating RKE cluster file~~~'.bold)
  Creator.setRKETemplate(Parser.parseRKETemplate())
  Creator.createRKE(Parser.parseRKEPath())
  console.log('>RKE cluster file created!<\n'.bold)
}