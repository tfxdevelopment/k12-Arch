# K12 Terraform 

This document serves as a guide on how to built, oragnize, and use the K12 terraform modules 


## Structure Reference
| File name | Purpose |
| ------- | ------ |
| `docs` | Contains module and environment templates as well as additional documentation |
| `environments` | One directory for each environment or stage which builds the environment and contains the environment-specific settings |
| `modules` | One directory for each distinct subsystem within K12 |
| `modules\core` | Builds resources that are shared across all (or most) subsystems like top-level DNS, base IAM, default machine images |


## Starting Out
### Installing Terraform for Windows
1. Download the latest terraform package from https://developer.hashicorp.com/terraform/install
2. Extract the zip file
3. Place the terraform.exe in a directory from your account's $PATH environment variable
4. Close and re-open any terminals or editors to load the new $PATH variable

## Building/Updating One Module

## Building/Updating An Entire Environment
 