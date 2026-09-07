# Prod — plan Section 4 column "Prod". Zone-redundant, 120-day interactive retention (+ archive to 3y).
subscription_id    = "00000000-0000-0000-0000-000000000000" # sub-k12-prod
tenant_id          = "00000000-0000-0000-0000-000000000000"
environment        = "prod"
location           = "eastus"
unique_suffix      = "cfi01"
is_production_like = true

vnet_address_space = ["10.43.0.0/20"]
subnet_prefixes = {
  aca   = "10.43.0.0/23"
  pe    = "10.43.2.0/24"
  appgw = "10.43.3.0/24"
}

log_retention_days         = 120
key_vault_soft_delete_days = 90
servicebus_capacity        = 2
eventhub_capacity          = 2
redis_sku                  = "Balanced_B5"
sql_sku                    = "GP_Gen5_4"

ops_architects_group_object_id = "00000000-0000-0000-0000-000000000000" # DBA / platform group in prod
sql_entra_admin_login          = "sg-k12-sql-admins"

tags = { cost_center = "k12-modernization", owner = "devops" }
