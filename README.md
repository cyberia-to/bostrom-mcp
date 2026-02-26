# bostrom-mcp

[MCP](https://modelcontextprotocol.io) server for the [Bostrom](https://cyb.ai) blockchain — knowledge graph, economy, lithium mining, governance, infrastructure, and **autonomous agent capabilities**.

87 tools: 44 read + 43 write. Read tools work with zero configuration. Write tools require a wallet mnemonic.

## Installation

### Option 1: Claude Desktop

Open **Settings > Developer > Edit Config** and add:

```jsonc
{
  "mcpServers": {
    "bostrom": {
      "command": "npx",
      "args": ["-y", "bostrom-mcp"]
    }
  }
}
```

Restart Claude Desktop. You should see the Bostrom tools in the tool list.

To enable write tools (send tokens, create cyberlinks, etc.), add your wallet mnemonic:

```jsonc
{
  "mcpServers": {
    "bostrom": {
      "command": "npx",
      "args": ["-y", "bostrom-mcp"],
      "env": {
        "BOSTROM_MNEMONIC": "your twelve word mnemonic phrase here ..."
      }
    }
  }
}
```

### Option 2: Claude Code (CLI)

```bash
claude mcp add bostrom -- npx -y bostrom-mcp
```

With write tools:

```bash
claude mcp add bostrom -e BOSTROM_MNEMONIC="your twelve word mnemonic phrase here ..." -- npx -y bostrom-mcp
```

### Option 3: Cursor

Open **Settings > MCP Servers > Add Server** and configure:

- **Name**: `bostrom`
- **Type**: `command`
- **Command**: `npx -y bostrom-mcp`

Or add to `.cursor/mcp.json` in your project:

```jsonc
{
  "mcpServers": {
    "bostrom": {
      "command": "npx",
      "args": ["-y", "bostrom-mcp"],
      "env": {
        "BOSTROM_MNEMONIC": "your twelve word mnemonic phrase here ..."
      }
    }
  }
}
```

### Option 4: Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```jsonc
{
  "mcpServers": {
    "bostrom": {
      "command": "npx",
      "args": ["-y", "bostrom-mcp"],
      "env": {
        "BOSTROM_MNEMONIC": "your twelve word mnemonic phrase here ..."
      }
    }
  }
}
```

### Option 5: Any MCP client

Run the server directly:

```bash
npx -y bostrom-mcp
```

The server communicates over stdio using the [Model Context Protocol](https://modelcontextprotocol.io). Any MCP-compatible client can connect to it.

### Getting a wallet

Write tools require a Bostrom wallet mnemonic. If you don't have one:

1. Install [cyb.ai](https://cyb.ai) or any Cosmos wallet (Keplr, Cosmostation)
2. Create a new wallet and save the mnemonic phrase
3. Fund it with BOOT tokens (needed for gas fees)
4. Set `BOSTROM_MNEMONIC` in your MCP client config

Without a mnemonic, all 44 read tools work normally — you can explore the knowledge graph, check balances, view proposals, and more.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BOSTROM_MNEMONIC` | — | Wallet mnemonic for write tools. Without it, only read tools are available. |
| `BOSTROM_RPC` | `https://rpc.bostrom.cybernode.ai` | RPC endpoint |
| `BOSTROM_LCD` | `https://lcd.bostrom.cybernode.ai` | LCD/REST endpoint |
| `BOSTROM_IPFS_API` | `https://io.cybernode.ai` | IPFS API for pinning content |
| `BOSTROM_GAS_PRICE` | `0.01boot` | Gas price |
| `BOSTROM_GAS_MULTIPLIER` | `1.4` | Gas estimate multiplier |
| `BOSTROM_MIN_GAS` | `100000` | Minimum gas limit |
| `BOSTROM_MAX_SEND_AMOUNT` | — | Circuit breaker: max amount per send (optional) |

## Tools

### Knowledge Graph — Read (6)

| Tool | Description |
|------|-------------|
| `graph_search` | Search cyberlinks by particle CID or neuron address |
| `graph_rank` | Get cyberank score for a particle |
| `graph_neuron` | Get neuron profile and cyberlink count |
| `graph_particle` | Fetch particle content by CID from IPFS |
| `graph_recent_links` | Get the most recent cyberlinks |
| `graph_stats` | Total cyberlinks and active neurons |

### Knowledge Graph — Write (5)

| Tool | Description |
|------|-------------|
| `graph_create_cyberlink` | Create a single cyberlink between two CIDs |
| `graph_create_cyberlinks` | Create multiple cyberlinks in one transaction |
| `graph_investmint` | Convert HYDROGEN into millivolt or milliampere |
| `graph_pin_content` | Pin text content to IPFS and return the CID |
| `graph_create_knowledge` | Compound: pin content to IPFS then create cyberlinks |

### Economy (6)

| Tool | Description |
|------|-------------|
| `economy_balances` | All token balances for an address |
| `economy_supply` | Total supply for a token denom |
| `economy_mint_price` | Current Volt and Ampere mint prices |
| `economy_staking` | Delegations, rewards, and unbonding for an address |
| `economy_pools` | Liquidity pool stats |
| `economy_inflation` | Current inflation rate and minting parameters |

### Wallet (7)

| Tool | Description |
|------|-------------|
| `wallet_info` | Get wallet address and all balances |
| `wallet_send` | Send tokens to an address |
| `wallet_delegate` | Delegate tokens to a validator |
| `wallet_undelegate` | Undelegate tokens from a validator |
| `wallet_redelegate` | Move delegation between validators |
| `wallet_claim_rewards` | Claim staking rewards from a validator |
| `wallet_vote` | Vote on a governance proposal |

### Token Factory (6)

| Tool | Description |
|------|-------------|
| `token_create` | Create a new token denom (costs ~10,000 BOOT) |
| `token_set_metadata` | Set token name, symbol, description, exponent |
| `token_mint` | Mint tokens to an address |
| `token_burn` | Burn tokens from an address |
| `token_change_admin` | Transfer token admin to another address |
| `token_list_created` | List all denoms created by this wallet |

### Liquidity & Swap (7)

| Tool | Description |
|------|-------------|
| `swap_tokens` | Swap tokens with auto pool discovery and price calculation |
| `swap_estimate` | Preview a swap: find pool, get price, estimate output |
| `liquidity_create_pool` | Create a Gravity DEX pool (costs ~1,000 BOOT) |
| `liquidity_deposit` | Deposit tokens into a pool |
| `liquidity_withdraw` | Withdraw LP tokens from a pool |
| `liquidity_swap` | Swap via pool with explicit pool ID and limit price |
| `liquidity_pool_detail` | Get pool reserves, parameters, and batch info |

### CosmWasm Contracts (7)

| Tool | Description |
|------|-------------|
| `contract_execute` | Execute a contract message |
| `contract_execute_multi` | Execute multiple contract messages atomically |
| `wasm_upload` | Upload .wasm bytecode to chain |
| `wasm_instantiate` | Instantiate a contract from code ID |
| `wasm_migrate` | Migrate a contract to new code |
| `wasm_update_admin` | Update contract admin |
| `wasm_clear_admin` | Clear contract admin (irreversible) |

### Lithium Mining — Read (25)

| Tool | Description |
|------|-------------|
| `li_core_config` | Token denom, admin, paused status |
| `li_burn_stats` | Total LI burned |
| `li_total_minted` | Total LI minted and supply cap |
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
| `li_stake_config` | Unbonding period, linked contracts |
| `li_total_staked` | Total LI staked across all stakers |
| `li_stake_info` | Staking state for an address |
| `li_staking_stats` | Reserve, total staked, reward index |
| `li_refer_config` | Referral contract config |
| `li_referrer_of` | Who referred a specific miner |
| `li_referral_info` | Referral rewards and count for a referrer |
| `li_community_pool` | Unclaimed community pool balance |
| `li_miner_tx_history` | Miner's recent contract TX history |

### Lithium Mining — Write (5)

| Tool | Description |
|------|-------------|
| `li_submit_proof` | Submit a mining proof |
| `li_stake` | Stake LI tokens |
| `li_unstake` | Unstake LI tokens |
| `li_claim_rewards` | Claim LI staking rewards |
| `li_set_referrer` | Set referrer for your address |

### Energy Grid (4)

| Tool | Description |
|------|-------------|
| `grid_create_route` | Create an energy route to another address |
| `grid_edit_route` | Edit route allocated value (millivolt/milliampere) |
| `grid_delete_route` | Delete an energy route |
| `grid_list_routes` | List all routes from an address |

### Governance (4)

| Tool | Description |
|------|-------------|
| `gov_proposals` | List proposals (active, passed, rejected, all) |
| `gov_proposal_detail` | Full proposal details with vote tally |
| `gov_validators` | Active validator set with commission and voting power |
| `gov_params` | Chain parameters |

### IBC (2)

| Tool | Description |
|------|-------------|
| `ibc_transfer` | IBC token transfer to another chain |
| `ibc_channels` | List IBC channels and their status |

### Infrastructure (3)

| Tool | Description |
|------|-------------|
| `infra_chain_status` | Latest block height, time, chain ID, sync status |
| `infra_tx_search` | Search transactions by sender, contract, or message type |
| `infra_tx_detail` | Full decoded transaction by hash |

## Agent workflows

With write tools enabled, an LLM agent can perform autonomous workflows:

- **Lithium mining**: `li_mine_state` → compute proof → `li_verify_proof` → `li_submit_proof` → `li_stake`
- **Token launch + market**: `token_create` → `token_set_metadata` → `token_mint` → `liquidity_create_pool` → `graph_create_knowledge`
- **Knowledge graph**: `graph_pin_content` → `graph_create_cyberlink` → `graph_search` → `graph_rank`
- **Governance**: `gov_proposals` → `gov_proposal_detail` → `wallet_vote`
- **DeFi**: `swap_estimate` → `swap_tokens` → `liquidity_deposit`
- **Contract deployment**: `wasm_upload` → `wasm_instantiate` → `contract_execute`

## Development

```bash
npm install
npm run build
node dist/index.js
```

## License

MIT
