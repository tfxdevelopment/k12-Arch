# ---------------------------------------------------------------------------
# MCSB NS-1 / NS-2: every PaaS resource is reached over a private endpoint,
# Container Apps run in a VNet-injected internal environment.
# ---------------------------------------------------------------------------

resource "azurerm_virtual_network" "this" {
  name                = "vnet-${local.prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  address_space       = var.vnet_address_space
  tags                = local.tags
}

# Container Apps infrastructure subnet. Workload-profile environments need a
# /27 minimum; /23 leaves room for scale. Delegation is mandatory.
resource "azurerm_subnet" "aca" {
  name                 = "snet-aca"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_prefixes.aca]

  delegation {
    name = "Microsoft.App.environments"
    service_delegation {
      name    = "Microsoft.App/environments"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_subnet" "pe" {
  name                              = "snet-private-endpoints"
  resource_group_name               = azurerm_resource_group.this.name
  virtual_network_name              = azurerm_virtual_network.this.name
  address_prefixes                  = [var.subnet_prefixes.pe]
  private_endpoint_network_policies = "Enabled" # lets NSG/UDR apply to private endpoints
}

resource "azurerm_subnet" "appgw" {
  name                 = "snet-appgw"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_prefixes.appgw]
}

# Deny-by-default NSG on the private endpoint subnet; only the ACA and App
# Gateway subnets may reach the PaaS endpoints.
resource "azurerm_network_security_group" "pe" {
  name                = "nsg-${local.prefix}-pe"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  tags                = local.tags

  security_rule {
    name                       = "allow-aca-to-pe"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = var.subnet_prefixes.aca
    destination_address_prefix = var.subnet_prefixes.pe
  }
  security_rule {
    name                       = "allow-appgw-to-pe"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = var.subnet_prefixes.appgw
    destination_address_prefix = var.subnet_prefixes.pe
  }
  security_rule {
    name                       = "deny-vnet-inbound"
    priority                   = 4000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }
}

resource "azurerm_subnet_network_security_group_association" "pe" {
  subnet_id                 = azurerm_subnet.pe.id
  network_security_group_id = azurerm_network_security_group.pe.id
}

# NAT Gateway gives Container Apps a stable egress IP (needed for allow-listing
# at NSC / SFTP partners) — swap for UDR -> Azure Firewall in stage/prod when
# the hub is ready (plan 5.3 "Egress control").
resource "azurerm_public_ip" "nat" {
  name                = "pip-${local.prefix}-nat"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = var.is_production_like ? ["1", "2", "3"] : null
  tags                = local.tags
}

resource "azurerm_nat_gateway" "this" {
  name                = "ng-${local.prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_name            = "Standard"
  tags                = local.tags
}

resource "azurerm_nat_gateway_public_ip_association" "this" {
  nat_gateway_id       = azurerm_nat_gateway.this.id
  public_ip_address_id = azurerm_public_ip.nat.id
}

resource "azurerm_subnet_nat_gateway_association" "aca" {
  subnet_id      = azurerm_subnet.aca.id
  nat_gateway_id = azurerm_nat_gateway.this.id
}

# ---------------------------------------------------------------------------
# Private DNS zones — one per private-link service in use, linked to the VNet.
# In a hub/spoke landing zone these live in the connectivity subscription and
# the "Configure ... private DNS zones" DINE policies create the records; keep
# this block for a self-contained environment.
# ---------------------------------------------------------------------------
locals {
  private_dns_zones = {
    keyvault      = "privatelink.vaultcore.azure.net"
    appconfig     = "privatelink.azconfig.io"
    servicebus    = "privatelink.servicebus.windows.net" # shared by Service Bus and Event Hubs
    blob          = "privatelink.blob.core.windows.net"
    sql           = "privatelink.database.windows.net"
    acr           = "privatelink.azurecr.io"
    redis         = "privatelink.redis.azure.net"
    containerapps = "privatelink.${var.location}.azurecontainerapps.io"
    staticwebapp  = "privatelink.azurestaticapps.net"
  }
}

resource "azurerm_private_dns_zone" "this" {
  for_each = local.private_dns_zones

  name                = each.value
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "this" {
  for_each = local.private_dns_zones

  name                  = "link-${each.key}-${local.prefix}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.this[each.key].name
  virtual_network_id    = azurerm_virtual_network.this.id
  registration_enabled  = false
  tags                  = local.tags
}
