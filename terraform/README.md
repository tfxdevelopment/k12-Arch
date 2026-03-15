# K12 Terraform 

This document serves as a guide on how to built, oragnize, and use the K12 terraform modules 


## Structure Reference
| File name | Purpose |
| ------- | ------ |
| `docs` | Contains module and environment templates as well as additional documentation |
| `environments` | One directory for each environment or stage which builds the environment and contains the environment-specific settings |
| `modules` | One directory for each distinct subsystem within K12 |
| `modules/core` | Builds resources that are shared across all (or most) subsystems like top-level DNS, base IAM, default machine images |
| `modules/landing-zone/hub` | Canonical hub networking module (Firewall, Bastion, hub VNet) — toggle-gated via `enable_landing_zone_platform` |
| `modules/landing-zone/spoke` | Canonical spoke networking module (spoke VNet, subnets, peering, route tables) — toggle-gated |
| `modules/shared` | Reusable shared platform primitives (Front Door, ACR, ACA environment) |
| `ARCHITECTURE.md` | Platform vs workload ownership boundaries and module source-of-truth policy |


## Starting Out
### Installing Terraform for Windows
1. Download the latest terraform package from https://developer.hashicorp.com/terraform/install
2. Extract the zip file
3. Place the terraform.exe in a directory from your account's $PATH environment variable
4. Close and re-open any terminals or editors to load the new $PATH variable

## Building/Updating One Module

## Building/Updating An Entire Environment
 