import { executeContract } from "./contract-exec.js";
import {
  LITIUM_MINE,
  LITIUM_STAKE,
  LITIUM_REFER,
  LITIUM_CORE,
} from "./lithium.js";
import { lcdSmartQuery } from "../clients/lcd.js";

/** Submit a v4 seed-based mining proof to the litium-mine contract */
export async function submitProof(
  hash: string,
  nonce: number,
  timestamp: number,
  miner_address?: string,
  referrer?: string,
  contract: string = LITIUM_MINE,
) {
  return executeContract(contract, {
    submit_proof: {
      hash,
      nonce,
      timestamp,
      ...(miner_address && { miner_address }),
      ...(referrer && { referrer }),
    },
  });
}

/** Submit a lithium v1 proof with block context */
export async function submitLithiumProof(
  hash: string,
  nonce: number,
  miner_address: string,
  block_hash: string,
  cyberlinks_merkle: string,
  epoch_id: number,
  timestamp: number,
  referrer?: string,
  contract: string = LITIUM_MINE,
) {
  return executeContract(contract, {
    submit_lithium_proof: {
      hash,
      nonce,
      miner_address,
      block_hash,
      cyberlinks_merkle,
      epoch_id,
      timestamp,
      ...(referrer && { referrer }),
    },
  });
}

/** Stake LI tokens in the litium-stake contract */
export async function stakeLi(
  amount: string,
  contract: string = LITIUM_STAKE,
) {
  // Staking sends LI tokens as funds to the stake contract
  // First get the token denom from core config
  const config = await lcdSmartQuery<{ token_denom: string }>(
    LITIUM_CORE,
    { config: {} },
  );
  return executeContract(
    contract,
    { stake: {} },
    [{ denom: config.token_denom, amount }],
  );
}

/** Unstake LI tokens from the litium-stake contract */
export async function unstakeLi(
  amount: string,
  contract: string = LITIUM_STAKE,
) {
  return executeContract(contract, {
    unstake: { amount },
  });
}

/** Claim staking rewards from the litium-stake contract */
export async function claimLiRewards(
  contract: string = LITIUM_STAKE,
) {
  return executeContract(contract, { claim_staking_rewards: {} });
}

/** Set referrer for the calling address in litium-refer */
export async function setReferrer(
  referrer: string,
  contract: string = LITIUM_REFER,
) {
  return executeContract(contract, {
    set_referrer: { referrer },
  });
}
