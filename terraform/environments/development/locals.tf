locals {
    tags = {
        environment = "development"
        source = "terraform"
    }
    environment_name = "development"
    location = "East US 2"
    publisher_name= "CFI"
    publisher_email = "luke.samuels@randstadusa.onmicrosoft.com"
    contributor_principal_id = "df8b0836-7e1b-41dc-8e66-6b6792256785"   # principal id of the group/user that will have the Contributor role assigned
    enable_zone_redundancy = false
    enable_acr_geo_replication = false
    enable_internal_load_balancer = false
    aca_min_replicas = 1
    aca_max_replicas = 5
    aca_cpu = 0.5
    aca_memory = "1Gi"
    dev_ip_list = {
        Luke            = "151.196.123.136"
        Brandon         = "75.232.70.158"
        Jason           = "136.226.2.112"
        John            = "99.114.124.169"
        Saj             = "70.106.216.229"
        Angelo          = "173.168.11.56"
        Mounisha        = "99.23.196.62"
        BrandonD        = "100.38.8.193"
        Jafeth          = "73.51.228.118"
        Margarita       = "96.255.236.185"
        Mario           = "47.203.166.159"
    }
    zscaler_ip_list = {
        start_ip        = "136.226.40.1"
        end_ip          = "136.226.60.255"
    }
    arm_role_receivers = [
        {
        name                    = "Monitoring Contributor"
        role_id                 = "749f88d5-cbae-40b8-bcfc-e573ddc772fa"
        use_common_alert_schema = true
        },
        {
        name                    = "Monitoring Reader"
        role_id                 = "43d0d8ad-25c7-4714-9337-8ba259a9fe05"
        use_common_alert_schema = true
        }
    ]
    sql_connection_string = "Server=tcp:development-api-enrollment.database.windows.net,1433;Initial Catalog=K12;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication=\"Active Directory Default\";"
    blob_storage_connection_string = "DefaultEndpointsProtocol=https;AccountName=devk12;AccountKey=Eyb2bJfCvd4LTCnbtpKBFcOU+pJZ4cNxrl1PICYUtXEm5Lct98DmAa8kAXLCFx+Zd/QEE51hVbUZ+AStKmhfzg==;EndpointSuffix=core.windows.net"
}