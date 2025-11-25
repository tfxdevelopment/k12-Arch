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
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const solutionRoot = path.resolve(__dirname, '../../..');

const server = new Server(
  {
    name: '@k12/aspire-mcp-server',
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
        name: 'aspire_run',
        description: 'Run the Aspire AppHost (launches all services)',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'AppHost project path (default: src/K12.AppHost)',
            },
          },
        },
      },
      {
        name: 'aspire_build',
        description: 'Build the Aspire solution',
        inputSchema: {
          type: 'object',
          properties: {
            configuration: {
              type: 'string',
              description: 'Build configuration (Debug or Release)',
            },
          },
        },
      },
      {
        name: 'aspire_manifest',
        description: 'Generate deployment manifest using azd infra synth',
        inputSchema: {
          type: 'object',
          properties: {
            output: {
              type: 'string',
              description: 'Output directory for manifests (default: ./infra/manifest)',
            },
          },
        },
      },
      {
        name: 'aspire_dashboard',
        description: 'Get the Aspire Dashboard URL',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'dotnet_workload',
        description: 'Manage .NET workloads (install, update, list)',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              description: 'Action: install, update, or list',
            },
            workload: {
              type: 'string',
              description: 'Workload name (e.g., aspire)',
            },
          },
          required: ['action'],
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
      case 'aspire_run': {
        const { project = 'src/K12.AppHost' } = args as { project?: string };
        const { stdout } = await execa('dotnet', ['run', '--project', project], {
          cwd: solutionRoot,
        });
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'aspire_build': {
        const { configuration = 'Debug' } = args as { configuration?: string };
        const { stdout } = await execa(
          'dotnet',
          ['build', 'K12.sln', '--configuration', configuration],
          { cwd: solutionRoot }
        );
        return {
          content: [{ type: 'text', text: stdout }],
        };
      }

      case 'aspire_manifest': {
        const { output = './infra/manifest' } = args as { output?: string };

        // Generate manifest using azd
        const { stdout } = await execa(
          'azd',
          ['infra', 'synth', '--output', output],
          { cwd: solutionRoot }
        );

        // Read generated manifest
        const manifestPath = path.join(solutionRoot, output, 'manifest.json');
        const manifest = await fs.readFile(manifestPath, 'utf-8');

        return {
          content: [
            { type: 'text', text: `Manifest generated at: ${manifestPath}\n\n${stdout}\n\nManifest content:\n${manifest}` }
          ],
        };
      }

      case 'aspire_dashboard': {
        return {
          content: [
            {
              type: 'text',
              text: 'Aspire Dashboard URL: https://localhost:17241\n\nAccess this URL after running `dotnet run --project src/K12.AppHost`',
            },
          ],
        };
      }

      case 'dotnet_workload': {
        const { action, workload } = args as { action: string; workload?: string };

        const workloadArgs = ['workload', action];
        if (workload) workloadArgs.push(workload);

        const { stdout } = await execa('dotnet', workloadArgs, {
          cwd: solutionRoot,
        });

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
  console.error('.NET Aspire MCP Server running on stdio');
}

main().catch(console.error);
