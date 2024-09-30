# K12 Terraform Module Template

## Structure Reference
| File name | Required | Purpose |
| ------- | ------ | ----- |
| main.tf | yes | Default location for resources in the module |
| variables.tf | yes | Defines input variables for the module |
| output.tf | yes | Defines relevant data that will be output by this module for use by another |
| dns.tf | | Define DNS records for items related to this subsystem. Top-level DNS and Zone settings are handled in the `core` module
| network.tf | | Define network-related resources  like 
| security.tf | | Define security groups and their rules
| vm.tf | | Define virtual machines, their storage, and machine images here



## Purpose
This directory lays out a default structure for Terraform modules so that modules can be created consistently, inter-operably, and in a well-organized manner.

## Usage
1. Copy the `module_template` directory into the base `k12-infra/terraform` directory and give it a name which identifies the subsystem it will build (*i.e. api-enrollment*)
2. Remove the `.tf` files related to resources your module will not need
3. Edit the `.tf` files for your resources and set them up accordingly.
4. For any input variables your module will use create an entry in `variables.tf` with a suitable default (if one exists). This value will be overridden per environment
5. Add any data that will need to be used by other modules (resource ids, IP addresses) to `outputs.tf` 