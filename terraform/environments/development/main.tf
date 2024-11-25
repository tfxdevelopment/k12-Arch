module "core" {
    source = "../../modules/core"
    #variables
    environment_name = var.environment_name
    location = var.location
    tags = var.tags
    zscaler_ip_list = var.zscaler_ip_list
    dev_ip_list = var.dev_ip_list
}

module "web-enrollment" {
    source = "../../modules/web-enrollment"
    #variables
    environment_name = var.environment_name
    location = var.location
    resource_group_name = module.core.rg_name
    tags = var.tags
    zscaler_ip_list = var.zscaler_ip_list
    dev_ip_list = var.dev_ip_list
}

module "api-enrollment" {
    source = "../../modules/api-enrollment"
    #variables
    environment_name = var.environment_name
    location = var.location
    resource_group_name = module.core.rg_name
    tags = var.tags
    zscaler_ip_list = var.zscaler_ip_list
    dev_ip_list = var.dev_ip_list
    publisher_email = var.publisher_email
    publisher_name = var.publisher_name
}