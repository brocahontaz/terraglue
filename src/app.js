const path = require('path')
const yargs = require('yargs')
const os = require('os')

const Parser = require('./parser')
const Creator = require('./creator')

const argv = yargs
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
  .alias('help', h)
  .argv

if (argv.rke) {
  console.log('RKE!')
}