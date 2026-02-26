# bostrom-mcp

Read-only [MCP](https://modelcontextprotocol.io) server for the [Bostrom](https://cyb.ai) blockchain — knowledge graph, economy, lithium mining, governance, and infrastructure.

44 tools, zero configuration, no API keys.

## Quick start

```jsonc
// Claude Desktop / Cursor / any MCP client
{
  "mcpServers": {
    "bostrom": {
      "command": "npx",
      "args": ["-y", "bostrom-mcp"]
    }
  }
}
```

Or run directly:

```bash
npx -y bostrom-mcp
```

## Tools

### Knowledge Graph (6)

| Tool | Description |
|------|-------------|
| `graph_search` | Search cyberlinks by particle CID or neuron address |
| `graph_rank` | Get cyberank score for a particle |
| `graph_neuron` | Get neuron profile and cyberlink count |
| `graph_particle` | Fetch particle content by CID from IPFS |
| `graph_recent_links` | Get the most recent cyberlinks |
| `graph_stats` | Total cyberlinks and active neurons |

### Economy (6)

| Tool | Description |
|------|-------------|
| `economy_balances` | All token balances for an address (BOOT, HYDROGEN, VOLT, AMPERE, LI) |
| `economy_supply` | Total supply for a token denom |
| `economy_mint_price` | Current Volt and Ampere mint prices |
| `economy_staking` | Delegations, rewards, and unbonding for an address |
| `economy_pools` | Liquidity pool stats |
| `economy_inflation` | Current inflation rate and minting parameters |

### Lithium Mining (25)

**Core**

| Tool | Description |
|------|-------------|
| `li_core_config` | Token denom, admin, paused status |
| `li_burn_stats` | Total LI burned |
| `li_total_minted` | Total LI minted and supply cap |

**Mine**

| Tool | Description |
|------|-------------|
| `li_mine_state` | Full mine state: config, seed, difficulty, stats, epoch, proofs, emission |
| `li_mine_config` | Difficulty, base reward, period duration, target proofs |
| `li_seed` | Current mining seed and interval |
| `li_difficulty` | Current difficulty, min profitable, window proof count |
| `li_epoch_status` | Current epoch: start/end blocks, proof count, target solutions |
| `li_proof_stats` | Epoch proof counters and total work |
| `li_emission` | Emission breakdown: mining, staking, referral |
| `li_reward_estimate` | Estimate LI reward for a given difficulty |
| `li_mine_stats` | Aggregate: total proofs, rewards, unique miners |
| `li_miner_stats` | Per-miner: proofs submitted, total rewards, last proof height |
| `li_miner_epoch_stats` | Miner's proof count for a specific epoch |
| `li_verify_proof` | Dry-run verify a proof without submitting |
| `li_recent_proofs` | Recent proof submission transactions |

**Stake**

| Tool | Description |
|------|-------------|
| `li_stake_config` | Unbonding period, linked contracts |
| `li_total_staked` | Total LI staked across all stakers |
| `li_stake_info` | Staking state for an address: staked, unbonding, rewards |
| `li_staking_stats` | Reserve, total staked, reward index |

**Referral**

| Tool | Description |
|------|-------------|
| `li_refer_config` | Referral contract config |
| `li_referrer_of` | Who referred a specific miner |
| `li_referral_info` | Referral rewards and count for a referrer |
| `li_community_pool` | Unclaimed community pool balance |

**Cross-contract**

| Tool | Description |
|------|-------------|
| `li_miner_tx_history` | Miner's recent contract TX history |

### Governance (4)

| Tool | Description |
|------|-------------|
| `gov_proposals` | List proposals (active, passed, rejected, all) |
| `gov_proposal_detail` | Full proposal details with vote tally |
| `gov_validators` | Active validator set with commission and voting power |
| `gov_params` | Chain parameters: staking, slashing, governance, distribution, minting |

### Infrastructure (3)

| Tool | Description |
|------|-------------|
| `infra_chain_status` | Latest block height, time, chain ID, sync status |
| `infra_tx_search` | Search transactions by sender, contract, or message type |
| `infra_tx_detail` | Full decoded transaction by hash |

## Development

```bash
npm install
npm run build
node dist/index.js
```

## License

MIT
