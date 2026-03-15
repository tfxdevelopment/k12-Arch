#!/bin/bash
# K12 Container Apps Deployment Validation Script
# Usage: ./validate-deployment.sh <environment>
# Example: ./validate-deployment.sh development

set -e

ENVIRONMENT=${1:-development}
RESOURCE_GROUP=$ENVIRONMENT

echo "🔍 Validating K12 Container Apps deployment for environment: $ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if logged into Azure
echo "1️⃣  Checking Azure CLI authentication..."
if ! az account show &>/dev/null; then
    echo "❌ Not logged into Azure CLI. Run 'az login' first."
    exit 1
fi
echo "✅ Authenticated to Azure"

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo "📍 Using subscription: $SUBSCRIPTION"
echo ""

# Check Resource Group
echo "2️⃣  Checking Resource Group..."
if ! az group show --name $RESOURCE_GROUP &>/dev/null; then
    echo "❌ Resource group '$RESOURCE_GROUP' not found"
    exit 1
fi
echo "✅ Resource group exists: $RESOURCE_GROUP"
echo ""

# Check VNet
echo "3️⃣  Checking Virtual Network..."
VNET_NAME="${ENVIRONMENT}-k12-vnet"
if az network vnet show --name $VNET_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ VNet exists: $VNET_NAME"
    VNET_ADDRESS=$(az network vnet show --name $VNET_NAME --resource-group $RESOURCE_GROUP --query "addressSpace.addressPrefixes[0]" -o tsv)
    echo "   Address space: $VNET_ADDRESS"
    
    # Check subnets
    echo "   Checking subnets..."
    SUBNETS=$(az network vnet subnet list --vnet-name $VNET_NAME --resource-group $RESOURCE_GROUP --query "[].{Name:name, Prefix:addressPrefix}" -o tsv)
    echo "$SUBNETS" | while IFS=$'\t' read -r name prefix; do
        echo "   ✅ $name: $prefix"
    done
else
    echo "⚠️  VNet not found (may not be deployed yet)"
fi
echo ""

# Check Redis Cache
echo "4️⃣  Checking Redis Cache..."
REDIS_NAME="${ENVIRONMENT}-k12-redis"
if az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Redis Cache exists: $REDIS_NAME"
    REDIS_SKU=$(az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query "sku.name" -o tsv)
    REDIS_HOST=$(az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query "hostName" -o tsv)
    echo "   SKU: $REDIS_SKU"
    echo "   Hostname: $REDIS_HOST"
else
    echo "⚠️  Redis Cache not found (may not be deployed yet)"
fi
echo ""

# Check Container Registry
echo "5️⃣  Checking Container Registry..."
ACR_NAME="${ENVIRONMENT//[-_]/}k12acr"
if az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ ACR exists: $ACR_NAME"
    ACR_SKU=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "sku.name" -o tsv)
    ACR_LOGIN=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" -o tsv)
    echo "   SKU: $ACR_SKU"
    echo "   Login server: $ACR_LOGIN"
    
    # Check for k12-api image
    echo "   Checking for k12-api image..."
    if az acr repository show --name $ACR_NAME --repository k12-api &>/dev/null; then
        TAGS=$(az acr repository show-tags --name $ACR_NAME --repository k12-api --output tsv | tr '\n' ', ' | sed 's/,$//')
        echo "   ✅ k12-api image exists with tags: $TAGS"
    else
        echo "   ⚠️  k12-api image not found - needs to be built"
    fi
else
    echo "❌ ACR not found"
fi
echo ""

# Check Log Analytics Workspace
echo "6️⃣  Checking Log Analytics Workspace..."
LA_NAME="${ENVIRONMENT}-aca-logs"
if az monitor log-analytics workspace show --workspace-name $LA_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Log Analytics Workspace exists: $LA_NAME"
    LA_ID=$(az monitor log-analytics workspace show --workspace-name $LA_NAME --resource-group $RESOURCE_GROUP --query "customerId" -o tsv)
    echo "   Workspace ID: $LA_ID"
else
    echo "⚠️  Log Analytics Workspace not found"
fi
echo ""

# Check Application Insights
echo "7️⃣  Checking Application Insights..."
AI_NAME="${ENVIRONMENT}-aca-insights"
if az monitor app-insights component show --app $AI_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Application Insights exists: $AI_NAME"
    AI_KEY=$(az monitor app-insights component show --app $AI_NAME --resource-group $RESOURCE_GROUP --query "instrumentationKey" -o tsv)
    echo "   Instrumentation Key: $AI_KEY"
else
    echo "⚠️  Application Insights not found"
fi
echo ""

# Check Container App Environment
echo "8️⃣  Checking Container App Environment..."
CAE_NAME="${ENVIRONMENT}-k12-cae"
if az containerapp env show --name $CAE_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Container App Environment exists: $CAE_NAME"
    CAE_DOMAIN=$(az containerapp env show --name $CAE_NAME --resource-group $RESOURCE_GROUP --query "properties.defaultDomain" -o tsv)
    echo "   Default domain: $CAE_DOMAIN"
    
    # Check Dapr components
    echo "   Checking Dapr components..."
    DAPR_COMPONENTS=$(az containerapp env dapr-component list --name $CAE_NAME --resource-group $RESOURCE_GROUP --query "[].{Name:name, Type:properties.componentType}" -o tsv)
    if [ -z "$DAPR_COMPONENTS" ]; then
        echo "   ⚠️  No Dapr components found"
    else
        echo "$DAPR_COMPONENTS" | while IFS=$'\t' read -r name type; do
            echo "   ✅ $name ($type)"
        done
    fi
else
    echo "❌ Container App Environment not found"
    exit 1
fi
echo ""

# Check Container App
echo "9️⃣  Checking Container App..."
CA_NAME="${ENVIRONMENT}-app"
if az containerapp show --name $CA_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Container App exists: $CA_NAME"
    CA_FQDN=$(az containerapp show --name $CA_NAME --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)
    CA_URL="https://$CA_FQDN"
    echo "   URL: $CA_URL"
    
    # Check Dapr configuration
    DAPR_ENABLED=$(az containerapp show --name $CA_NAME --resource-group $RESOURCE_GROUP --query "properties.configuration.dapr.enabled" -o tsv)
    if [ "$DAPR_ENABLED" == "true" ]; then
        DAPR_APP_ID=$(az containerapp show --name $CA_NAME --resource-group $RESOURCE_GROUP --query "properties.configuration.dapr.appId" -o tsv)
        echo "   ✅ Dapr enabled (App ID: $DAPR_APP_ID)"
    else
        echo "   ⚠️  Dapr not enabled"
    fi
    
    # Check replica status
    echo "   Checking replicas..."
    REPLICAS=$(az containerapp replica list --name $CA_NAME --resource-group $RESOURCE_GROUP --query "length(@)" -o tsv 2>/dev/null || echo "0")
    echo "   Running replicas: $REPLICAS"
    
    # Test health endpoints
    echo "   Testing health endpoints..."
    if command -v curl &>/dev/null; then
        if curl -sSf -o /dev/null -w "%{http_code}" "$CA_URL/health/live" 2>/dev/null | grep -q "200"; then
            echo "   ✅ /health/live: OK (200)"
        else
            echo "   ⚠️  /health/live: Not responding or not 200"
        fi
        
        if curl -sSf -o /dev/null -w "%{http_code}" "$CA_URL/health/ready" 2>/dev/null | grep -q "200"; then
            echo "   ✅ /health/ready: OK (200)"
        else
            echo "   ⚠️  /health/ready: Not responding or not 200"
        fi
    else
        echo "   ⚠️  curl not available - skipping health check tests"
    fi
else
    echo "❌ Container App not found"
    exit 1
fi
echo ""

# Check Key Vault
echo "🔟 Checking Key Vault..."
KV_NAME="${ENVIRONMENT}apikv"
if az keyvault show --name $KV_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ Key Vault exists: $KV_NAME"
    
    # Check for required secrets
    echo "   Checking for required secrets..."
    REQUIRED_SECRETS=("sql-connection-string" "blob-connection-string" "redis-connection-string")
    for secret in "${REQUIRED_SECRETS[@]}"; do
        if az keyvault secret show --vault-name $KV_NAME --name $secret &>/dev/null; then
            echo "   ✅ $secret: exists"
        else
            echo "   ⚠️  $secret: not found"
        fi
    done
    
    # Check RBAC permissions for Container App
    echo "   Checking RBAC permissions..."
    CA_PRINCIPAL=$(az containerapp show --name $CA_NAME --resource-group $RESOURCE_GROUP --query "identity.principalId" -o tsv)
    if [ -n "$CA_PRINCIPAL" ]; then
        KV_ID=$(az keyvault show --name $KV_NAME --resource-group $RESOURCE_GROUP --query "id" -o tsv)
        if az role assignment list --scope "$KV_ID" --assignee "$CA_PRINCIPAL" --query "[?roleDefinitionName=='Key Vault Secrets User']" -o tsv | grep -q .; then
            echo "   ✅ Container App has 'Key Vault Secrets User' role"
        else
            echo "   ⚠️  Container App missing 'Key Vault Secrets User' role"
        fi
    fi
else
    echo "⚠️  Key Vault not found"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ = Ready"
echo "⚠️  = Needs attention"
echo "❌ = Missing/Error"
echo ""
echo "Next steps:"
echo "1. If ACR image is missing: az acr build --registry $ACR_NAME --image k12-api:latest --file Dockerfile ."
echo "2. If health checks failing: Check application logs with 'az containerapp logs show --name $CA_NAME --resource-group $RESOURCE_GROUP --follow'"
echo "3. If secrets missing: az keyvault secret set --vault-name $KV_NAME --name <secret-name> --value '<secret-value>'"
echo ""
echo "📖 Documentation:"
echo "   - Setup guide: terraform/docs/CONTAINER_APPS_SETUP.md"
echo "   - Dapr integration: terraform/docs/DAPR_INTEGRATION.md"
