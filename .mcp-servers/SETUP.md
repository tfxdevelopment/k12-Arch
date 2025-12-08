# MCP Servers Setup Guide

Quick setup instructions for the K12 custom MCP servers.

## One-Time Setup

### 1. Install Dependencies

Run this from the root of the K12 workspace:

```bash
# Install NX MCP Server dependencies
cd .mcp-servers/nx-mcp
npm install
npm run build
cd ..

# Install Aspire MCP Server dependencies
cd aspire-mcp
npm install
npm run build
cd ..
```

### 2. Verify Installation

Check that both servers compiled successfully:

```bash
ls -la .mcp-servers/nx-mcp/dist/
ls -la .mcp-servers/aspire-mcp/dist/
```

Both should contain an `index.js` file.

### 3. Verify mcp.json Configuration

The `mcp.json` file in the root should already contain:

```json
{
  "mcpServers": {
    "nx-workspace": {
      "command": "node",
      "args": [".mcp-servers/nx-mcp/dist/index.js"]
    },
    "aspire-cli": {
      "command": "node",
      "args": [".mcp-servers/aspire-mcp/dist/index.js"]
    }
  }
}
```

## Usage in Claude Code

Once installed and configured, you can use these servers immediately:

### NX Workspace Tools

```
"List all projects in the NX workspace"
"Build the documentation site"
"Run tests for the shared library"
"Show the dependency graph"
```

### Aspire Tools

```
"Run the Aspire AppHost"
"Build the K12 solution"
"Show the Aspire Dashboard URL"
"Generate deployment manifest"
"Install the aspire workload"
```

## Updating the Servers

To update a server after changes:

```bash
# For NX MCP
cd .mcp-servers/nx-mcp
npm run build

# For Aspire MCP
cd .mcp-servers/aspire-mcp
npm run build
```

The servers will automatically reload in Claude Code.

## Troubleshooting

### "Cannot find module" errors
- Ensure you ran `npm install` in the server directory
- Check Node.js version: `node --version` (requires 18+)

### "dist/index.js not found"
- Run `npm run build` in the server directory
- Verify TypeScript compiled without errors

### Tools not appearing in Claude Code
- Confirm mcp.json paths are correct
- Restart Claude Code session
- Check that `node dist/index.js` runs without errors

### NX tools fail
- Ensure you're in a project with a `docs-site` directory
- Check: `ls docs-site/` exists
- Verify NX is installed: `npx nx --version`

### Aspire tools fail
- Ensure .NET 8+ is installed: `dotnet --version`
- Install Aspire workload: `dotnet workload install aspire`
- Check Azure DevOps CLI: `azd version`

## Development

To modify a server while working:

```bash
cd .mcp-servers/nx-mcp  # or aspire-mcp
npm run watch
```

This will automatically rebuild on file changes. Restart Claude Code to reload the server.

## File Paths

All paths in the MCP servers are relative to the K12 workspace root:

- **NX Workspace**: `c:/Projects/CFI/K12/k12-Arch/docs-site`
- **Aspire Solution**: `c:/Projects/CFI/K12/k12-Arch`

## Architecture Overview

```
K12 Workspace (c:/Projects/CFI/K12/k12-Arch/)
├── mcp.json                          (Server configuration)
├── .mcp-servers/                     (Custom MCP servers)
│   ├── nx-mcp/                       (NX workspace tools)
│   │   ├── src/index.ts             (Server implementation)
│   │   ├── dist/index.js            (Compiled output)
│   │   └── package.json
│   └── aspire-mcp/                  (.NET Aspire tools)
│       ├── src/index.ts             (Server implementation)
│       ├── dist/index.js            (Compiled output)
│       └── package.json
├── docs-site/                        (NX workspace)
└── K12.sln / K12.Aspire.sln         (.NET solutions)
```

## Next Steps

1. Run the setup steps above
2. Verify both servers compile
3. Use Claude Code with natural language commands
4. Refer to server READMEs for detailed tool documentation

See `README.md` in this directory for complete documentation.
