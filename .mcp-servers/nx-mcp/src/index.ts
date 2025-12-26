#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../docs-site');

const server = new Server(
  {
    name: '@k12/nx-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'nx_run',
        description: 'Run an NX target (build, test, lint, serve)',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'Project name (e.g., documentation)',
            },
            target: {
              type: 'string',
              description: 'Target to run (e.g., build, test, lint, serve)',
            },
            configuration: {
              type: 'string',
              description: 'Configuration (e.g., production, development)',
            },
          },
          required: ['project', 'target'],
        },
      },
      {
        name: 'nx_graph',
        description: 'Show the NX dependency graph',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'nx_list',
        description: 'List all projects in the NX workspace',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'nx_affected',
        description: 'Show affected projects based on git changes',
        inputSchema: {
          type: 'object',
          properties: {
            base: {
              type: 'string',
              description: 'Base branch to compare against (default: main)',
            },
          },
        },
      },
      {
        name: 'nx_generate',
        description: 'Generate code using NX generators',
        inputSchema: {
          type: 'object',
          properties: {
            schematic: {
              type: 'string',
              description: 'Generator schematic (e.g., @nx/angular:component)',
            },
            name: {
              type: 'string',
              description: 'Name of the generated artifact',
            },
            project: {
              type: 'string',
              description: 'Project to generate in',
            },
          },
          required: ['schematic', 'name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'nx_run': {
        const { project, target, configuration } = args as {
          project: string;
          target: string;
          configuration?: string;
        };
        const configArg = configuration ? `--configuration=${configuration}` : '';
        const { stdout } = await execa('nx', [target, project, configArg].filter(Boolean), {
          cwd: workspaceRoot,
        });
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'nx_graph': {
        const { stdout } = await execa('nx', ['graph', '--file=graph.json'], {
          cwd: workspaceRoot,
        });
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'nx_list': {
        const { stdout } = await execa('nx', ['list'], {
          cwd: workspaceRoot,
        });
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'nx_affected': {
        const { base = 'main' } = args as { base?: string };
        const { stdout } = await execa('nx', ['affected', '--base=' + base], {
          cwd: workspaceRoot,
        });
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'nx_generate': {
        const { schematic, name: artifactName, project } = args as {
          schematic: string;
          name: string;
          project?: string;
        };
        const projectArg = project ? `--project=${project}` : '';
        const { stdout } = await execa(
          'nx',
          ['generate', schematic, artifactName, projectArg].filter(Boolean),
          { cwd: workspaceRoot }
        );
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('NX MCP Server running on stdio');
}

main().catch(console.error);
