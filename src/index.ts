#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGraphTools } from "./tools/graph.js";
import { registerEconomyTools } from "./tools/economy.js";
import { registerLithiumTools } from "./tools/lithium.js";
import { registerGovernanceTools } from "./tools/governance.js";
import { registerInfraTools } from "./tools/infra.js";

export function createServer() {
  const server = new McpServer({
    name: "bostrom",
    version: "0.1.0",
  });

  registerGraphTools(server);
  registerEconomyTools(server);
  registerLithiumTools(server);
  registerGovernanceTools(server);
  registerInfraTools(server);

  return server;
}

export const createSandboxServer = createServer;

const isDirectRun =
  import.meta.url && process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const server = createServer();
  const transport = new StdioServerTransport();
  server.connect(transport).catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });
}
