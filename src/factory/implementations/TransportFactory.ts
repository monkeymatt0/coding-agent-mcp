import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { TransportInterface } from "../interfaces/TransportInterface";
import { Transport } from "../types/Transport";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";

export class TransportFactory implements TransportInterface {
     createTransport(type: string): Transport {
          switch(type){
               case 'http':
                    return new StreamableHTTPServerTransport({
                         enableJsonResponse: true,
                         sessionIdGenerator: undefined,
                    });
               default:
                    return new StdioServerTransport();
          }
     }
}