#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGraphTools } from "./tools/graph.js";
import { registerEconomyTools } from "./tools/economy.js";
import { registerLithiumTools } from "./tools/lithium.js";
import { registerGovernanceTools } from "./tools/governance.js";
import { registerInfraTools } from "./tools/infra.js";

const server = new McpServer({
  name: "bostrom",
  version: "0.1.0",
});

registerGraphTools(server);
registerEconomyTools(server);
registerLithiumTools(server);
registerGovernanceTools(server);
registerInfraTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
