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
    dev_ip_list = {
        Luke            = "151.196.123.136"
        Brandon         = "75.241.107.96"
        Jason           = "136.226.2.112"
        John            = "99.114.124.169"
        Saj             = "108.44.218.186"
    }
    zscaler_ip_list = {
        start_ip        = "136.226.40.1"
        end_ip          = "136.226.60.255"
    }
}