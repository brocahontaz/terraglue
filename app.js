import Parser from './parser.js'
// import Creator from './creator'
try {
  const parser = new Parser('/home/brocahontaz/repos/acme-infrastructure/terraform/terraform.tfstate')
  console.log(parser.getAllInstances())
  console.log(parser.getNamedInstances('k8s_master'))
} catch (err) {
  console.log(err)
}
