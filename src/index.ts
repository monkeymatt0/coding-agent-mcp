#!/usr/bin/env node

import * as z from 'zod/v4';
import express from 'express'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  Tool,
  CallToolResult
} from '@modelcontextprotocol/sdk/types.js';

import { FileOperations } from './tools/file-operations.js';
import { TerminalOperations } from './tools/terminal-operations.js';
import { SearchOperations } from './tools/search-operations.js';
import { UtilityOperations } from './tools/utility-operations.js';
import { TransportFactory } from './factory/implementations/TransportFactory.js';
import { TOOL_SCHEMAS } from './factory/types/ToolSchemas.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

/**
 * Coding Agent MCP Server
 * Provides comprehensive coding agent capabilities including file operations,
 * terminal commands, search functionality, and utility operations.
 * 
 * @author Sukarth Acharya
 */
class CodingAgentMCPServer {
  private server: McpServer;
  private fileOps: FileOperations;
  private terminalOps: TerminalOperations;
  private searchOps: SearchOperations;
  private utilityOps: UtilityOperations;

  constructor() {
    this.server = new McpServer(
      {
        name: 'coding-agent-mcp',
        version: '1.0.1',
      },
      {
        capabilities: { tools: {} },
      }
      
    );

    this.fileOps = new FileOperations();
    this.terminalOps = new TerminalOperations();
    this.searchOps = new SearchOperations();
    this.utilityOps = new UtilityOperations();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    const tools: Tool[] = [
      ...this.fileOps.getTools(),
      ...this.terminalOps.getTools(),
      ...this.searchOps.getTools(),
      ...this.utilityOps.getTools(),
    ];

    for (let i = 0; i < tools.length; i++) {
      const schema = TOOL_SCHEMAS[tools[i].name]
      this.server.registerTool(
        tools[i].name,
        {
          description: tools[i].description,
          inputSchema: schema ?? z.record(z.string(), z.any())
        },
        async(args) => {
          try {
            return await this.routeToolCall(tools[i].name, args)
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { content: [{ type: 'text' as const, text: `Error: ${msg}` }] };
  }
        }
      );
      
    }
  }

private async routeToolCall(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
  try {
    if (this.fileOps.hasTools(name)) {
      return await this.fileOps.handleTool(name, args);
    }
    if (this.terminalOps.hasTools(name)) {
      return await this.terminalOps.handleTool(name, args);
    }
    if (this.searchOps.hasTools(name)) {
      return await this.searchOps.handleTool(name, args);
    }
    if (this.utilityOps.hasTools(name)) {
      return await this.utilityOps.handleTool(name, args);
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text' as const, text: `Error executing tool ${name}: ${msg}` }],
    };
  }
}

  async start(type: string): Promise<void> {
    const transportFactory = new TransportFactory();
    switch(type) {
      case 'http':
        const app = express();
        app.use(express.json());
        app.all("/mcp", (req, _res, next) => {
          if (!req.headers.accept?.includes('text/event-stream')) {
            req.headers.accept = 'application/json, text/event-stream';
          }
          next();
        },
        async(req, res) => {
          const transport = transportFactory.createTransport(type) as StreamableHTTPServerTransport;
          await this.server.close();
          await this.server.connect(transport);
          await transport.handleRequest(req, res, req.body);
        });
        const port = process.env.PORT ?? 3000;
        app.listen(port, () => {
          console.error(`MCP HTTP server listening on http://localhost:${port}/mcp`);
        })
        break;
      default:
        const transport = transportFactory.createTransport(type);
        await this.server.connect(transport);
        break;
    }
    console.error('Coding Agent MCP Server started');
  }
}

let transportType: string = '';

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Coding Agent MCP Server v1.0.1
A comprehensive MCP server providing coding agent capabilities

Usage: coding-agent-mcp [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

Features:
  • File Operations: Read, write, edit, copy, move, delete files and directories
  • Terminal Operations: Execute commands with working directory control
  • Search Operations: Text search, file search, find & replace, duplicate detection
  • Utility Operations: Delays, system info, UUID generation, encoding, hashing

For more information, visit: https://github.com/sukarth/coding-agent-mcp
`);
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('1.0.1');
  process.exit(0);
}

if (process.argv.includes('HTTP') || process.argv.includes('http')) {
  console.log('HTTP server starting...');
  transportType = 'http';
}

// Start the server
const server = new CodingAgentMCPServer();
server.start(transportType).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});