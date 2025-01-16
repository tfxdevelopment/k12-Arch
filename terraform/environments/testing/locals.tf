locals {
    tags = {
        environment = "testing"
        source = "terraform"
    }
    environment_name = "testing"
    location = "East US 2"
    publisher_name= "CFI"
    publisher_email = "luke.samuels@randstadusa.onmicrosoft.com"
    contributor_principal_id = "df8b0836-7e1b-41dc-8e66-6b6792256785"   # principal id of the group/user that will have the Contributor role assigned
    dev_ip_list = {
        Luke            = "151.196.123.136"
        Brandon         = "75.241.107.96"
        Jason           = "136.226.2.112"
        John            = "99.114.124.169"
        Saj             = "108.44.218.186"
        Angelo          = "184.89.241.44"
        Mounisha        = "99.23.196.62"
        BrandonD        = "68.132.46.95"
        Jafeth          = "104.13.182.33"
        Margarita       = "96.255.236.185"
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
}