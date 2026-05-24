<!-- BEGIN ContextStream -->
# Workspace: K12 Azure
# Workspace ID: 88a586eb-0e78-4841-b4fd-32f080419e2a

## ContextStream MCP Tools

### Required Every Message

| Message | What to Call |
|---------|--------------|
| **1st message** | `session_init(folder_path="<cwd>", context_hint="<user_message>")` |
| **2nd+ messages** | `context_smart(user_message="<message>", format="minified", max_tokens=400)` |
| **Search code** | `search(mode="hybrid", query="...")` — BEFORE Glob/Grep/Read |
| **Save decisions** | `session(action="capture", event_type="decision", title="...", content="...")` |

### Search Modes

| Mode | Use Case |
|------|----------|
| `hybrid` | General code search |
| `keyword` | Exact symbol/string |
| `semantic` | Conceptual questions |
| `exhaustive` | Find ALL matches |

### Quick Reference

- Always call `session_init` first with `context_hint` set to user's message
- Call `context_smart` before every response for relevant context
- Use `search` before local file tools (Glob, Grep, Read)
- Capture decisions with `session(action="capture")`
<!-- END ContextStream -->