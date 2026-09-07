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

# Digest-pinned (S1/K12-8497): resolve with
#   docker buildx imagetools inspect <registry>/<repo>:<tag>
# and paste the sha256 — mutable tags are rejected by validation.
container_app_image = "mcr.microsoft.com/k8se/quickstart@sha256:0000000000000000000000000000000000000000000000000000000000000000"

# Prod runs in Azure Government: AMR and SWA are absent from the Gov GA
# roadmap, so both gates are off (classic Redis / SWA fallback per data_web.tf
# and messaging_config_cache.tf comments) until availability is confirmed.
deploy_managed_redis  = false
deploy_static_web_app = false

ops_architects_group_object_id = "00000000-0000-0000-0000-000000000000" # DBA / platform group in prod
sql_entra_admin_login          = "sg-k12-sql-admins"

tags = { cost_center = "k12-modernization", owner = "devops" }
