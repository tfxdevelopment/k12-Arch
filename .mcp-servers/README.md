# K12 Custom MCP Servers

This directory contains custom MCP (Model Context Protocol) servers for the K12 architecture workspace.

## Available Servers

### 1. NX Workspace MCP Server

Provides tools for managing NX monorepo operations including build, test, lint, and code generation.

**Location:** `./nx-mcp/`

**Key Tools:**
- `nx_run` - Execute NX targets
- `nx_list` - List projects
- `nx_graph` - Show dependency graph
- `nx_affected` - Show affected projects
- `nx_generate` - Generate code using schematics

**Setup:**
```bash
cd nx-mcp
npm install
npm run build
```

**Documentation:** See `nx-mcp/README.md`

### 2. .NET Aspire MCP Server

Provides tools for managing .NET Aspire application development and deployment.

**Location:** `./aspire-mcp/`

**Key Tools:**
- `aspire_run` - Run AppHost
- `aspire_build` - Build solution
- `aspire_manifest` - Generate deployment manifests
- `aspire_dashboard` - Get dashboard URL
- `dotnet_workload` - Manage workloads

**Setup:**
```bash
cd aspire-mcp
npm install
npm run build
```

**Documentation:** See `aspire-mcp/README.md`

## Installation

Install all servers:

```bash
# Install NX MCP dependencies
cd nx-mcp
npm install
npm run build
cd ..

# Install Aspire MCP dependencies
cd aspire-mcp
npm install
npm run build
cd ..
```

## Configuration

Both servers are registered in `../mcp.json`:

```json
{
  "nx-workspace": {
    "command": "node",
    "args": [".mcp-servers/nx-mcp/dist/index.js"],
    "description": "Manage NX workspace operations"
  },
  "aspire-cli": {
    "command": "node",
    "args": [".mcp-servers/aspire-mcp/dist/index.js"],
    "description": "Manage .NET Aspire operations"
  }
}
```

## Usage with Claude Code

Once configured in `mcp.json`, Claude Code will automatically load these servers.

### Example: Using NX Tools

```
"Build the documentation site for production"
```

Claude will use the `nx_run` tool to:
```json
{
  "project": "documentation",
  "target": "build",
  "configuration": "production"
}
```

### Example: Using Aspire Tools

```
"Run the Aspire AppHost and show me the dashboard URL"
```

Claude will use:
1. `aspire_run` to start the application
2. `aspire_dashboard` to provide the URL

## Development

### Building

Each server uses TypeScript. Build with:

```bash
# In nx-mcp or aspire-mcp directory
npm run build
```

### Watch Mode

For development, use watch mode:

```bash
npm run watch
```

### Testing

After building, test by running directly:

```bash
npm run start
```

## Architecture

Each MCP server:
- Uses the official MCP SDK (`@modelcontextprotocol/sdk`)
- Implements standard request handlers for `ListTools` and `CallTool`
- Communicates via stdio with the Claude Code agent
- Handles errors and returns structured responses

## File Structure

```
.mcp-servers/
├── README.md                    # This file
├── .gitignore                   # Excludes node_modules, dist
├── nx-mcp/
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md
│   └── src/
│       └── index.ts
└── aspire-mcp/
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    └── src/
        └── index.ts
```

## Troubleshooting

### Server won't start
- Ensure Node.js 18+ is installed
- Verify `npm install` was run
- Check that `npm run build` succeeded
- Review `.mcp-servers/{server-name}/dist/` exists

### Tools not available
- Confirm the server is registered in `mcp.json`
- Check Claude Code can read the `.mcp-servers` path
- Verify the command paths in `mcp.json` are correct

### Tool execution fails
- For NX tools: ensure you're in the docs-site workspace
- For Aspire tools: ensure .NET 8+ is installed and `azd` is available
- Check error messages returned by tools for specific issues

## Contributing

To add new tools to an existing server or create new servers:

1. Add the tool definition to `ListToolsRequestSchema` handler
2. Implement the tool in `CallToolRequestSchema` handler
3. Update the corresponding README.md
4. Rebuild with `npm run build`
5. Test before committing

## Integration with K12 Repositories

These MCP servers support the K12 workspace:

- **k12-docs** (NX workspace) - Documentation site
- **K12.sln / K12.Aspire.sln** - .NET Aspire solution

They enable Claude Code to:
- Build and test the documentation site
- Launch and manage Aspire services
- Generate deployment configurations
- Provide workspace insights
