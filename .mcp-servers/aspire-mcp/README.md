# .NET Aspire MCP Server

Custom MCP server for managing .NET Aspire application development and deployment.

## Features

This server provides tools to interact with .NET Aspire for the K12 solution:

- **aspire_run**: Run the Aspire AppHost to launch all services
- **aspire_build**: Build the Aspire solution
- **aspire_manifest**: Generate deployment manifests
- **aspire_dashboard**: Get the Aspire Dashboard URL
- **dotnet_workload**: Manage .NET workloads (install, update, list)

## Installation

```bash
npm install
npm run build
```

## Prerequisites

- .NET 8.0 or later
- Azure Developer CLI (azd) for manifest generation
- Node.js 18+ for running the MCP server

## Available Tools

### aspire_run
Run the Aspire AppHost to launch all configured services.

**Parameters:**
- `project` (optional): AppHost project path (default: src/K12.AppHost)

**Example:**
```json
{
  "project": "src/K12.AppHost"
}
```

After running, access the Aspire Dashboard at: https://localhost:17241

### aspire_build
Build the Aspire solution.

**Parameters:**
- `configuration` (optional): Build configuration (default: Debug)
  - Options: Debug, Release

### aspire_manifest
Generate deployment manifests using Azure Developer CLI.

**Parameters:**
- `output` (optional): Output directory for manifests (default: ./infra/manifest)

**Example:**
```json
{
  "output": "./infra/manifest"
}
```

This creates a `manifest.json` file containing the deployment configuration.

### aspire_dashboard
Get information about the Aspire Dashboard.

Returns:
- Dashboard URL: https://localhost:17241
- Access instructions

### dotnet_workload
Manage .NET workloads for development.

**Parameters:**
- `action` (required): Action to perform (install, update, list)
- `workload` (optional): Workload name (e.g., aspire, maui, etc.)

**Examples:**
```json
{
  "action": "list"
}
```

```json
{
  "action": "install",
  "workload": "aspire"
}
```

## Configuration

The server is configured to run against the K12 solution root:
`c:/Projects/CFI/K12/k12-Arch`

## Running the Server

```bash
npm run start
```

Or use the MCP configuration in `mcp.json` to automatically launch this server.

## Aspire Dashboard

Once the AppHost is running via `aspire_run`, access the dashboard at:
- URL: https://localhost:17241
- Shows all running services
- Provides logs, metrics, and traces
- Allows service restart and configuration

## Deployment

The `aspire_manifest` tool generates manifests compatible with:
- Azure Container Instances
- Azure Container Apps
- Docker Compose
- Kubernetes

The generated manifests can be deployed using Azure Developer CLI (`azd deploy`).
