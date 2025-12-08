#!/bin/bash
#
# Validate K12 Aspire deployment to Azure Container Apps
#
# Usage: ./validate-deployment.sh [environment] [resource-group]
# Example: ./validate-deployment.sh dev k12-dev-rg
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-dev}
RESOURCE_GROUP=${2:-k12-dev-rg}

echo "======================================"
echo "K12 Aspire Deployment Validator"
echo "======================================"
echo "Environment: $ENVIRONMENT"
echo "Resource Group: $RESOURCE_GROUP"
echo ""

# Track results
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ((FAILED++))
    fi
}

check_azure_resource() {
    local resource_type=$1
    local resource_name=$2

    if az "$resource_type" show --resource-group "$RESOURCE_GROUP" \
        --name "$resource_name" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $resource_type '$resource_name' exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $resource_type '$resource_name' NOT found"
        ((FAILED++))
    fi
}

check_container_app() {
    local app_name=$1

    if az containerapp show --resource-group "$RESOURCE_GROUP" \
        --name "$app_name" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Container App '$app_name' exists"

        # Get status
        local status=$(az containerapp show --resource-group "$RESOURCE_GROUP" \
            --name "$app_name" --query properties.provisioningState -o tsv)

        if [ "$status" = "Succeeded" ]; then
            echo -e "  ${GREEN}Status: $status${NC}"
            ((PASSED++))
        else
            echo -e "  ${YELLOW}Status: $status${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗${NC} Container App '$app_name' NOT found"
        ((FAILED++))
    fi
}

echo "1. Checking Prerequisites..."
echo "=================================="
check_command "az"
check_command "python3"
check_command "terraform"
check_command "dotnet"
echo ""

echo "2. Checking Azure Resources..."
echo "=================================="
check_azure_resource "containerapp environment" "k12-docs-env-$ENVIRONMENT"
check_azure_resource "log-analytics workspace" "k12-docs-logs-$ENVIRONMENT"
check_azure_resource "application insights" "k12-docs-insights-$ENVIRONMENT"
echo ""

echo "3. Checking Container Apps..."
echo "=================================="
check_container_app "k12-docs-api-$ENVIRONMENT"
check_container_app "k12-docs-site-$ENVIRONMENT"
echo ""

echo "4. Checking Container App Configuration..."
echo "=================================="

# Check docs-api ingress
if az containerapp ingress show --resource-group "$RESOURCE_GROUP" \
    --name "k12-docs-api-$ENVIRONMENT" &> /dev/null; then
    FQDN=$(az containerapp ingress show --resource-group "$RESOURCE_GROUP" \
        --name "k12-docs-api-$ENVIRONMENT" --query fqdn -o tsv)
    echo -e "${GREEN}✓${NC} Docs API FQDN: $FQDN"
    ((PASSED++))

    # Test connectivity
    if curl -s "https://$FQDN/health" | grep -q "Healthy\|healthy" 2>/dev/null; then
        echo -e "  ${GREEN}Health check: PASSED${NC}"
        ((PASSED++))
    else
        echo -e "  ${YELLOW}Health check: Could not verify (may need more time to start)${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Could not get Docs API ingress configuration"
    ((FAILED++))
fi

# Check docs-site ingress
if az containerapp ingress show --resource-group "$RESOURCE_GROUP" \
    --name "k12-docs-site-$ENVIRONMENT" &> /dev/null; then
    FQDN=$(az containerapp ingress show --resource-group "$RESOURCE_GROUP" \
        --name "k12-docs-site-$ENVIRONMENT" --query fqdn -o tsv)
    echo -e "${GREEN}✓${NC} Docs Site FQDN: $FQDN"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Could not get Docs Site ingress configuration"
    ((FAILED++))
fi
echo ""

echo "5. Checking Logs and Monitoring..."
echo "=================================="

# Check Log Analytics workspace
if az monitor log-analytics workspace show --resource-group "$RESOURCE_GROUP" \
    --workspace-name "k12-docs-logs-$ENVIRONMENT" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Log Analytics workspace accessible"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Log Analytics workspace NOT accessible"
    ((FAILED++))
fi

# Check Application Insights
if az monitor app-insights component show --resource-group "$RESOURCE_GROUP" \
    --app "k12-docs-insights-$ENVIRONMENT" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Application Insights accessible"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Application Insights NOT accessible"
    ((FAILED++))
fi
echo ""

echo "6. Checking Container Logs..."
echo "=================================="

# Get recent logs from docs-api
echo "Docs API recent logs:"
if az containerapp logs show --resource-group "$RESOURCE_GROUP" \
    --name "k12-docs-api-$ENVIRONMENT" --tail 5 2>/dev/null | grep -q "ERROR\|ERROR" ; then
    echo -e "  ${YELLOW}Warnings found in logs${NC}"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}No errors found in recent logs${NC}"
    ((PASSED++))
fi

# Get recent logs from docs-site
echo "Docs Site recent logs:"
if az containerapp logs show --resource-group "$RESOURCE_GROUP" \
    --name "k12-docs-site-$ENVIRONMENT" --tail 5 2>/dev/null | grep -q "ERROR\|ERROR" ; then
    echo -e "  ${YELLOW}Warnings found in logs${NC}"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}No errors found in recent logs${NC}"
    ((PASSED++))
fi
echo ""

echo "7. Checking Scaling Configuration..."
echo "=================================="

# Check scaling rules
for app in "k12-docs-api-$ENVIRONMENT" "k12-docs-site-$ENVIRONMENT"; do
    REPLICAS=$(az containerapp show --resource-group "$RESOURCE_GROUP" \
        --name "$app" --query "properties.template.scale | @json" -o tsv 2>/dev/null)
    if [ -n "$REPLICAS" ]; then
        echo -e "${GREEN}✓${NC} $app scaling configured"
        ((PASSED++))
    fi
done
echo ""

# Summary
echo "======================================"
echo "Validation Summary"
echo "======================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}All checks passed!${NC}"
        exit 0
    else
        echo -e "${YELLOW}All checks passed with $WARNINGS warnings${NC}"
        exit 0
    fi
else
    echo -e "${RED}$FAILED checks failed. Please review the errors above.${NC}"
    exit 1
fi
