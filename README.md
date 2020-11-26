# terraglue
Smart little app constructing config files for tools like Ansible, rke, etc from Terraform provisioned resources.

# Terraglue is now available as an executable!
After a complete rewrite of the code base to improve the application, it is now also provided as an executable file - removing the hassle of installing it with yarn/npm!

## Install & Run
Simply download the binary provided in the first release under [releases](https://github.com/brocahontaz/terraglue/releases).

### Local install
Put the binary in the folder you want to use it in.

To run it, simple download the binary and use `./terraglue <config.json> <flags>` where the config file is in your current working directory. 

### PATH
Put the binary in a folder available in your path, such as `usr/bin`.

Now you'll be able to use it wherever you are in your system!

Simply call `terraglue <config.json> <flags>`

## Config file example
An example of the format of the needed config file can be found here https://github.com/brocahontaz/terraglue/blob/main/src/config.json

## Flags
The following flags are supported:

* `-s` / `--ssh` creates an SSH config file
* `-a` / `--ansible` creates an Ansible hosts file
* `-r` / `--rke` creates an RKE cluster file
* `-h` / `--help` shows available commands
