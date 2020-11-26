const path = require('path')
const yargs = require('yargs')
const os = require('os')

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

if (argv.rke) {
  console.log('RKE!')
}

if (argv.ansible) {
  console.log('Ansible!')
}

if (argv.ssh) {
  console.log('SSH!')
}

console.log(argv.file)