# NX Workspace MCP Server

Custom MCP server for managing NX workspace operations in the K12 documentation project.

## Features

This server provides tools to interact with the NX monorepo build system:

- **nx_run**: Execute NX targets (build, test, lint, serve) on specific projects
- **nx_list**: List all projects in the workspace
- **nx_graph**: Display the dependency graph
- **nx_affected**: Show projects affected by recent git changes
- **nx_generate**: Generate code using NX generators/schematics

## Installation

```bash
npm install
npm run build
```

## Available Tools

### nx_run
Run an NX target on a project.

**Parameters:**
- `project` (required): Project name (e.g., documentation)
- `target` (required): Target to run (e.g., build, test, lint, serve)
- `configuration` (optional): Configuration to use (e.g., production, development)

**Example:**
```json
{
  "project": "documentation",
  "target": "build",
  "configuration": "production"
}
```

### nx_list
List all projects in the NX workspace.

### nx_graph
Generate and display the NX dependency graph.

### nx_affected
Show projects affected by changes compared to a base branch.

**Parameters:**
- `base` (optional): Base branch (default: main)

### nx_generate
Generate code using NX generators.

**Parameters:**
- `schematic` (required): Generator schematic (e.g., @nx/angular:component)
- `name` (required): Name of the artifact to generate
- `project` (optional): Project to generate in

## Configuration

The server is configured to run against the `docs-site` workspace at:
`c:/Projects/CFI/K12/k12-Arch/docs-site`

To change the workspace root, modify the `workspaceRoot` constant in `src/index.ts`.

## Running the Server

```bash
npm run start
```

Or use the MCP configuration in `mcp.json` to automatically launch this server.
