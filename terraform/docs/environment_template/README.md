# K12 Terraform Environment Template

This directory lays out a default structure for Terraform environments so that they are consistent and easy to build/manage

## Structure Reference
| File name | Required | Purpose |
| ------- | ------ | ----- |
| `main.tf` | **yes** | Defines what modules will be used and which variables will be passed to them |
| `variables.tf` | **yes** | Defines input variables for the environment. These override the values set in the modules |
| `data.tf` | **yes** |  |



## Usage
1. Copy the `environment_template` directory into the `k12-infra/terraform/environments` directory and give it a name which identifies the environment or stage it will build (*i.e. dev, prod*)
2. Edit the `.tf` files for your resources and set them up accordingly.
4. If you are overriding the default value for any module variables create an entry for them in `variables.tf`.
5. 