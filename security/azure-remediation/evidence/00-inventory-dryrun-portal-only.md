# Inventory dry-run — k12-cms exclusion applied (offline)

Source: `k12-Arch/sources/AzureResourceGraphFormattedResults-Query 1.csv` (Dec 2025 commercial-tenant export).

Total **184** · excluded (k12-cms estate) **35** · in scope **149**

## In-scope by resource group

| Resource group | Count |
|---|---|
| development | 56 |
| testing | 39 |
| staging | 31 |
| k12-infra | 4 |
| k12-web-east | 3 |
| k12-fe-insights-development | 3 |
| defaultresourcegroup-eus | 3 |
| rab-data-factory-test1 | 2 |
| defaultresourcegroup-eus2 | 2 |
| networkwatcherrg | 1 |
| loganalyticsdefaultresources | 1 |
| k12-content-dev | 1 |
| ai_testing-api-enrollment-insights_871ff6a9-81e0-43a6-aa8e-d97294fe9b99_managed | 1 |
| ai_staging-api-enrollment-insights_f9e70d9a-0a30-432b-be96-74c858cf272d_managed | 1 |
| ai_development-api-enrollment-insights_999d8e7f-d6c9-425c-92b5-1967d47e6b6a_managed | 1 |

## In-scope by type

| Type | Count |
|---|---|
| Front Door | 12 |
| Endpoint | 12 |
| Static Web App | 12 |
| Storage account | 12 |
| SQL database | 10 |
| API Connection | 9 |
| Application Insights | 7 |
| App Service plan | 7 |
| Shared dashboard | 6 |
| App Service | 6 |
| Log Analytics workspace | 6 |
| Smart detector alert rule | 5 |
| Managed Identity | 5 |
| Availability test | 5 |
| Action group | 4 |
| SignalR | 4 |
| Key vault | 4 |
| API Management service | 3 |
| SQL server | 3 |
| Data factory (V2) | 2 |
| microsoft.security/securityconnectors | 2 |
| Solution | 2 |
| Network Watcher | 1 |
| Log Analytics query pack | 1 |
| Web PubSub Service | 1 |
| Network security group | 1 |
| Virtual network | 1 |
| Foundry | 1 |
| Shared dashboard (preview) | 1 |
| Event Grid Namespace | 1 |
| Service Bus Namespace | 1 |
| Logic app | 1 |
| Container registry | 1 |

## Excluded (k12-cms estate)

| Name | Type | RG |
|---|---|---|
| DevOpsServiceConnection | Managed Identity | k12-cms |
| Failure Anomalies - app-k12-site-prd | Smart detector alert rule | k12-cms |
| Failure Anomalies - app-k12-site-prd-dr | Smart detector alert rule | k12-cms |
| K12 Admin Actions | Activity log alert rule | k12-cms |
| K12 Prod Down | Activity log alert rule | k12-cms |
| K12-CMS Production Resource Health Alert | Activity log alert rule | k12-cms |
| K12-CMS-Communication | Communication Service | k12-cms |
| K12-Email | Email Communication Service | k12-cms |
| LA-cf6841bb-b70c-K12-CMS-EastUS2 | Log Analytics workspace | k12-cms |
| Notify_Netsupport | Action group | k12-cms |
| app-k12-site-prd | Application Insights | k12-cms |
| app-k12-site-prd | App Service | k12-cms |
| app-k12-site-prd-dr | Application Insights | k12-cms |
| app-k12-site-prd-dr | App Service | k12-cms |
| app-k12-site-prd/warmup | App Service (Slot) | k12-cms |
| app-k12-site-stg | App Service | k12-cms |
| app-k12-site-stg | Application Insights | k12-cms |
| cf6841bb-b70c-4d55-a489-2d53855e78b5-K12-CMS-CUS | Log Analytics workspace | k12-cms |
| default | Endpoint | k12-cms |
| fd-k12-site-shared | Endpoint | k12-cms |
| fd-k12-site-shared | Front Door | k12-cms |
| la-k12-site-shared | Log Analytics workspace | k12-cms |
| master | SQL database | k12-cms |
| master | SQL database | k12-cms |
| ncseaa.edu | Email Communication Services Domain | k12-cms |
| plan-k12-site-prd-dr | App Service plan | k12-cms |
| plan-k12-site-shared | App Service plan | k12-cms |
| sql-k12-site-shared | SQL server | k12-cms |
| sql-k12-site-shared-dr | SQL server | k12-cms |
| sqlauditk12cms | Storage account | k12-cms |
| sqldb-k12-site-prd | SQL database | k12-cms |
| sqldb-k12-site-prd | SQL database | k12-cms |
| sqldb-k12-site-stg | SQL database | k12-cms |
| sqlep-k12-site-shared | SQL elastic pool | k12-cms |
| stk12data | Storage account | k12-cms |
