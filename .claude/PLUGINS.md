# K12-Arch Plugin Recommendations

This architecture documentation repository benefits from documentation-focused plugins.

## Recommended Plugins

Create `.claude/settings.local.json`:

```json
{
  "enabledPlugins": {
    "documentation-generator@claude-code-templates": true,
    "documentation-generation@claude-code-workflows": true
  }
}
```

## Plugin Details

### documentation-generator@claude-code-templates
- Technical writing and content creation
- README files, architecture docs
- Docusaurus site configuration

### documentation-generation@claude-code-workflows
- API documentation (OpenAPI)
- Code documentation from source
- Tutorial and reference generation
- Mermaid diagram creation

## Already Enabled Globally

These plugins are always available (no configuration needed):
- `git-workflow@claude-code-templates` - Git Flow management
- `code-review-ai@claude-code-workflows` - Documentation review
- `shell-scripting@claude-code-workflows` - Build scripts

## MCP Servers Available

This repository includes custom MCP servers (see `mcp.json`):
- **nx-workspace** - NX monorepo operations for docs-site
- **aspire-cli** - .NET Aspire operations
- **microsoft-learn** - Microsoft documentation access
