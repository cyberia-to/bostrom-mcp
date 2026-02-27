import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS } from "../util.js";
import * as svc from "../services/lithium-write.js";
import { LITIUM_MINE, LITIUM_STAKE, LITIUM_REFER } from "../services/lithium.js";

export function registerLithiumWriteTools(server: McpServer) {
  server.registerTool(
    "li_submit_proof",
    {
      description:
        "Submit a v4 seed-based mining proof to earn LI tokens. " +
        "First use li_verify_proof to dry-run, then submit if valid.",
      inputSchema: {
        hash: z.string().describe("Computed hash (hex)"),
        nonce: z.number().describe("Nonce value"),
        timestamp: z.number().describe("Timestamp (unix seconds)"),
        miner_address: z.string().optional().describe("Miner address (defaults to tx sender)"),
        referrer: z.string().optional().describe("Referrer address (optional)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ hash, nonce, timestamp, miner_address, referrer, contract }) =>
      ok(await svc.submitProof(hash, nonce, timestamp, miner_address, referrer, contract)),
    ),
  );

  server.registerTool(
    "li_submit_lithium_proof",
    {
      description:
        "Submit a lithium v1 proof (block-context based). " +
        "Requires block_hash and cyberlinks_merkle from li_block_context, " +
        "and epoch_id from li_epoch_status.",
      inputSchema: {
        hash: z.string().describe("Computed hash (hex)"),
        nonce: z.number().describe("Nonce value"),
        miner_address: z.string().describe("Miner address (bostrom1...)"),
        block_hash: z.string().describe("Block hash (hex, 32 bytes)"),
        cyberlinks_merkle: z.string().describe("Data hash / cyberlinks merkle (hex, 32 bytes)"),
        epoch_id: z.number().describe("Current lithium epoch ID"),
        timestamp: z.number().describe("Timestamp (unix seconds)"),
        referrer: z.string().optional().describe("Referrer address (optional)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ hash, nonce, miner_address, block_hash, cyberlinks_merkle, epoch_id, timestamp, referrer, contract }) =>
      ok(await svc.submitLithiumProof(hash, nonce, miner_address, block_hash, cyberlinks_merkle, epoch_id, timestamp, referrer, contract)),
    ),
  );

  server.registerTool(
    "li_stake",
    {
      description:
        "Stake LI tokens to earn staking rewards. " +
        "Sends LI tokens to the stake contract.",
      inputSchema: {
        amount: z.string().describe("Amount of LI to stake (base units)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ amount, contract }) =>
      ok(await svc.stakeLi(amount, contract)),
    ),
  );

  server.registerTool(
    "li_unstake",
    {
      description:
        "Unstake LI tokens. Subject to unbonding period.",
      inputSchema: {
        amount: z.string().describe("Amount of LI to unstake (base units)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ amount, contract }) =>
      ok(await svc.unstakeLi(amount, contract)),
    ),
  );

  server.registerTool(
    "li_claim_rewards",
    {
      description:
        "Claim LI staking rewards from the stake contract.",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract }) =>
      ok(await svc.claimLiRewards(contract)),
    ),
  );

  server.registerTool(
    "li_set_referrer",
    {
      description:
        "Set your referrer in the litium-refer contract. " +
        "Referrer earns a share of your mining rewards. Can only be set once.",
      inputSchema: {
        referrer: z.string().describe("Referrer address (bostrom1...)"),
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ referrer, contract }) =>
      ok(await svc.setReferrer(referrer, contract)),
    ),
  );
}
