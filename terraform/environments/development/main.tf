module "core" {
    source = "../../modules/core"
    #variables
    environment_name = local.environment_name
    location = local.location
    tags = merge(local.tags, {module = "core"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    contributor_principal_id = local.contributor_principal_id
}

module "enrollment-web" {
    source = "../../modules/web-enrollment"
    #variables
    app_name = "enrollment"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(local.tags, {module = "web-enrollment"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
}

module "enrollment-api" {
    source = "../../modules/api-enrollment"
    #variables
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(local.tags, {module = "api-enrollment"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
    publisher_email = local.publisher_email
    publisher_name = local.publisher_name
    arm_role_receivers  = local.arm_role_receivers
}

module "admin-web" {
    source = "../../modules/web-enrollment"
    #variables
    app_name = "admin"
    environment_name = local.environment_name
    location = local.location
    resource_group_name = module.core.rg_name
    tags = merge(local.tags, {module = "web-enrollment"})
    zscaler_ip_list = local.zscaler_ip_list
    dev_ip_list = local.dev_ip_list
}