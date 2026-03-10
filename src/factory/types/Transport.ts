import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

export type Transport = StdioServerTransport | StreamableHTTPServerTransport;