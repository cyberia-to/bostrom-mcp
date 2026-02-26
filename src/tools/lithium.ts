import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, paginationHint, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/lithium.js";
import {
  LITIUM_CORE,
  LITIUM_MINE,
  LITIUM_STAKE,
  LITIUM_REFER,
} from "../services/lithium.js";

export function registerLithiumTools(server: McpServer) {
  // ── litium-core ──────────────────────────────────────────────

  server.registerTool(
    "li_core_config",
    {
      description: "Get litium-core config: token_denom, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getCoreConfig(contract))),
  );

  server.registerTool(
    "li_burn_stats",
    {
      description: "Get LI burn stats: total_burned via contract-mediated transfers",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getBurnStats(contract))),
  );

  server.registerTool(
    "li_total_minted",
    {
      description: "Get total LI minted and supply cap",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getTotalMinted(contract))),
  );

  // ── litium-mine ──────────────────────────────────────────────

  server.registerTool(
    "li_mine_state",
    {
      description:
        "Get full litium-mine state: config, seed, difficulty, stats, epoch_status, proof_stats, emission breakdown",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineState(contract))),
  );

  server.registerTool(
    "li_mine_config",
    {
      description:
        "Get litium-mine config: difficulty, base_reward, alpha_permille, max_proof_age, period_duration, lithium_epoch_duration_blocks, target_proofs_per_window, estimated_gas_cost_uboot, core/stake/refer contracts",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineConfig(contract))),
  );

  server.registerTool(
    "li_seed",
    {
      description: "Get current mining seed and seed_interval",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getSeed(contract))),
  );

  server.registerTool(
    "li_difficulty",
    {
      description:
        "Get difficulty info: current, min_profitable, window_proof_count, window_total_work",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getDifficulty(contract))),
  );

  server.registerTool(
    "li_epoch_status",
    {
      description:
        "Get current Lithium epoch: epoch_id, start/end block heights, proof_count, target_solutions, difficulty",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getEpochStatus(contract))),
  );

  server.registerTool(
    "li_proof_stats",
    {
      description: "Get current epoch proof counters: epoch_id, proof_count, total_work",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getProofStats(contract))),
  );

  server.registerTool(
    "li_emission",
    {
      description:
        "Get Lithium emission breakdown: epoch_id, mining_emission, staking_emission, referral_emission, total_emission",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getLithiumEmissionInfo(contract))),
  );

  server.registerTool(
    "li_reward_estimate",
    {
      description:
        "Estimate LI reward for a given difficulty: gross_reward, estimated_gas_cost_uboot, earns_reward",
      inputSchema: {
        difficulty_bits: z.number().min(1).describe("Difficulty in bits (leading zero bits)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ difficulty_bits, contract }) =>
      ok(await svc.calculateReward(contract, difficulty_bits)),
    ),
  );

  server.registerTool(
    "li_mine_stats",
    {
      description: "Get aggregate mining stats: total_proofs, total_rewards, unique_miners, avg_difficulty",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineStats(contract))),
  );

  server.registerTool(
    "li_miner_stats",
    {
      description:
        "Get per-miner stats: proofs_submitted, total_rewards, last_proof_height",
      inputSchema: {
        address: z.string().describe("Miner address (bostrom1...)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getMinerStats(contract, address)),
    ),
  );

  server.registerTool(
    "li_miner_epoch_stats",
    {
      description: "Get a miner's proof count for a specific Lithium epoch",
      inputSchema: {
        address: z.string().describe("Miner address (bostrom1...)"),
        epoch_id: z.number().min(0).describe("Lithium epoch ID"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, epoch_id, contract }) =>
      ok(await svc.getLithiumMinerEpochStats(contract, address, epoch_id)),
    ),
  );

  server.registerTool(
    "li_verify_proof",
    {
      description: "Dry-run verify a proof without submitting: valid, difficulty_bits, estimated_reward",
      inputSchema: {
        hash: z.string().describe("Computed hash (hex)"),
        nonce: z.number().describe("Nonce"),
        timestamp: z.number().describe("Timestamp (unix seconds)"),
        miner: z.string().describe("Miner address (bostrom1...)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ hash, nonce, timestamp, miner, contract }) =>
      ok(await svc.verifyProof(contract, hash, nonce, timestamp, miner)),
    ),
  );

  server.registerTool(
    "li_recent_proofs",
    {
      description: "Get recent proof submission transactions for the mine contract",
      inputSchema: {
        limit: z.number().min(1).max(50).default(10),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ limit, contract }) => {
      const proofs = await svc.getRecentProofs(contract, limit);
      const pagination = paginationHint("li_recent_proofs", 0, limit, proofs);
      return ok({ proofs, ...(pagination && { pagination }) });
    }),
  );

  // ── litium-stake ─────────────────────────────────────────────

  server.registerTool(
    "li_stake_config",
    {
      description:
        "Get litium-stake config: core_contract, mine_contract, token_denom, unbonding_period_seconds, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getStakeConfig(contract))),
  );

  server.registerTool(
    "li_total_staked",
    {
      description: "Get total LI staked across all stakers",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getTotalStaked(contract))),
  );

  server.registerTool(
    "li_stake_info",
    {
      description:
        "Get staking state for an address: staked_amount, pending_unbonding, pending_unbonding_until, claimable_rewards",
      inputSchema: {
        address: z.string().describe("Staker address (bostrom1...)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getStakeInfo(contract, address)),
    ),
  );

  server.registerTool(
    "li_staking_stats",
    {
      description: "Get aggregate staking stats: reserve, total_staked, reward_index",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getStakingStats(contract))),
  );

  // ── litium-refer ─────────────────────────────────────────────

  server.registerTool(
    "li_refer_config",
    {
      description:
        "Get litium-refer config: core_contract, mine_contract, community_pool_addr, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getReferConfig(contract))),
  );

  server.registerTool(
    "li_referrer_of",
    {
      description: "Get who referred a specific miner",
      inputSchema: {
        miner: z.string().describe("Miner address (bostrom1...)"),
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ miner, contract }) =>
      ok(await svc.getReferrerOf(contract, miner)),
    ),
  );

  server.registerTool(
    "li_referral_info",
    {
      description: "Get referral stats for a referrer: referral_rewards, referrals_count",
      inputSchema: {
        address: z.string().describe("Referrer address (bostrom1...)"),
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getReferralInfo(contract, address)),
    ),
  );

  server.registerTool(
    "li_community_pool",
    {
      description: "Get unclaimed community pool balance (referral rewards for miners without referrer)",
      inputSchema: {
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getCommunityPoolBalance(contract))),
  );

  // ── cross-contract: miner TX history ─────────────────────────

  server.registerTool(
    "li_miner_tx_history",
    {
      description: "Get a miner's recent contract execution TX history and total count",
      inputSchema: {
        address: z.string().describe("Miner address (bostrom1...)"),
        limit: z.number().min(1).max(50).default(20),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, limit }) => {
      const result = await svc.getMinerTxHistory(address, limit);
      const pagination = paginationHint("li_miner_tx_history", 0, limit, result.recent_txs);
      return ok({ ...result, ...(pagination && { pagination }) });
    }),
  );
}
