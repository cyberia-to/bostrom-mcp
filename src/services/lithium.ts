import { lcdSmartQuery } from "../clients/lcd.js";
import { graphql } from "../clients/graphql.js";

// Litium modular contract addresses
export const LITIUM_CORE = "bostrom1wsgx32y0tx5rk6g89ffr8hg2wucnpwp650e9nrdm80jeyku5u4zq5ashgz";
export const LITIUM_MINE = "bostrom1vsfzcplds5z9xxl0llczeskxjxuddckksjm2u5ft2xt03qg28ups04mfes";
export const LITIUM_STAKE = "bostrom1z0s6rxw8eq4wy25kaucy5jydlphlpzpglsle5n7nx2gaqd60rmgqs67tnz";
export const LITIUM_REFER = "bostrom1m8a0jzyyu794cmd5clkt37kr0kkqvxyra23gnqcg5929n63ryhpss3986d";

// --- litium-core queries ---

export async function getCoreConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getBurnStats(contract: string) {
  return lcdSmartQuery(contract, { burn_stats: {} });
}

export async function getTotalMinted(contract: string) {
  return lcdSmartQuery(contract, { total_minted: {} });
}

export async function isAuthorizedCaller(contract: string, address: string) {
  return lcdSmartQuery(contract, { is_authorized_caller: { address } });
}

// --- litium-mine queries ---

export async function getMineConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getSeed(contract: string) {
  return lcdSmartQuery(contract, { seed: {} });
}

export async function getDifficulty(contract: string) {
  return lcdSmartQuery(contract, { difficulty: {} });
}

export async function getEpochStatus(contract: string) {
  return lcdSmartQuery(contract, { epoch_status: {} });
}

export async function getTarget(contract: string) {
  return lcdSmartQuery(contract, { target: {} });
}

export async function getProofStats(contract: string) {
  return lcdSmartQuery(contract, { proof_stats: {} });
}

export async function getLithiumEmissionInfo(contract: string) {
  return lcdSmartQuery(contract, { lithium_emission_info: {} });
}

export async function getLithiumMinerEpochStats(
  contract: string,
  address: string,
  epochId: number,
) {
  return lcdSmartQuery(contract, {
    lithium_miner_epoch_stats: { address, epoch_id: epochId },
  });
}

export async function getMineStats(contract: string) {
  return lcdSmartQuery(contract, { stats: {} });
}

export async function getMinerStats(contract: string, address: string) {
  return lcdSmartQuery(contract, { miner_stats: { address } });
}

export async function verifyProof(
  contract: string,
  hash: string,
  nonce: number,
  timestamp: number,
  miner: string,
) {
  return lcdSmartQuery(contract, {
    verify_proof: { hash, nonce, timestamp, miner },
  });
}

export async function calculateReward(contract: string, difficultyBits: number) {
  return lcdSmartQuery(contract, {
    calculate_reward: { difficulty_bits: difficultyBits },
  });
}

/** Composite: full mine contract state */
export async function getMineState(contract: string) {
  const [config, seed, difficulty, stats, epochStatus, proofStats, emission] =
    await Promise.all([
      lcdSmartQuery(contract, { config: {} }),
      lcdSmartQuery(contract, { seed: {} }),
      lcdSmartQuery(contract, { difficulty: {} }),
      lcdSmartQuery(contract, { stats: {} }),
      lcdSmartQuery(contract, { epoch_status: {} }),
      lcdSmartQuery(contract, { proof_stats: {} }),
      lcdSmartQuery(contract, { lithium_emission_info: {} }),
    ]);
  return { config, seed, difficulty, stats, epoch_status: epochStatus, proof_stats: proofStats, emission };
}

// --- litium-stake queries ---

export async function getStakeConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getTotalStaked(contract: string) {
  return lcdSmartQuery(contract, { total_staked: {} });
}

export async function getStakeInfo(contract: string, address: string) {
  return lcdSmartQuery(contract, { stake_info: { address } });
}

export async function getStakingStats(contract: string) {
  return lcdSmartQuery(contract, { staking_stats: {} });
}

// --- litium-refer queries ---

export async function getReferConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getReferrerOf(contract: string, miner: string) {
  return lcdSmartQuery(contract, { referrer_of: { miner } });
}

export async function getReferralInfo(contract: string, address: string) {
  return lcdSmartQuery(contract, { referral_info: { address } });
}

export async function getCommunityPoolBalance(contract: string) {
  return lcdSmartQuery(contract, { community_pool_balance: {} });
}

// --- TX history (via graphql, works for any contract) ---

interface TxMessage {
  transaction_hash: string;
  value: unknown;
  transaction: {
    block: { height: number; timestamp: string };
    success: boolean;
  };
}

export async function getRecentProofs(contract: string, limit: number) {
  const result = await graphql<{
    messages_by_address: TxMessage[];
  }>(`{
    messages_by_address(
      args: {
        addresses: "{${contract}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      },
      limit: ${limit},
      order_by: {transaction_hash: desc}
    ) {
      transaction_hash
      value
      transaction { block { height timestamp } success }
    }
  }`);
  return result.messages_by_address;
}

export async function getMinerTxHistory(address: string, limit: number) {
  const result = await graphql<{
    messages_by_address: TxMessage[];
    messages_by_address_aggregate: { aggregate: { count: number } };
  }>(`{
    messages_by_address(
      args: {
        addresses: "{${address}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      },
      limit: ${limit},
      order_by: {transaction_hash: desc}
    ) {
      transaction_hash
      value
      transaction { block { height timestamp } success }
    }
    messages_by_address_aggregate(
      args: {
        addresses: "{${address}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      }
    ) { aggregate { count } }
  }`);

  return {
    total_txs: result.messages_by_address_aggregate.aggregate.count,
    recent_txs: result.messages_by_address,
  };
}
