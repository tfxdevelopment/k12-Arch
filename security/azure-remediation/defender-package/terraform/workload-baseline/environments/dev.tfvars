# Dev — plan Section 4 column "Dev". Same controls as prod, smaller/cheaper.
subscription_id    = "00000000-0000-0000-0000-000000000000" # sub-k12-nonprod
tenant_id          = "00000000-0000-0000-0000-000000000000"
environment        = "dev"
location           = "eastus"
unique_suffix      = "cfi01"
is_production_like = false

vnet_address_space = ["10.40.0.0/20"]
subnet_prefixes = {
  aca   = "10.40.0.0/23"
  pe    = "10.40.2.0/24"
  appgw = "10.40.3.0/24"
}

log_retention_days         = 30
key_vault_soft_delete_days = 7
servicebus_capacity        = 1
eventhub_capacity          = 1
redis_sku                  = "Balanced_B0"
sql_sku                    = "GP_S_Gen5_1"

ops_architects_group_object_id = "00000000-0000-0000-0000-000000000000" # sg-k12-ops-architects
sql_entra_admin_login          = "sg-k12-ops-architects"

tags = { cost_center = "k12-modernization", owner = "architecture" }
