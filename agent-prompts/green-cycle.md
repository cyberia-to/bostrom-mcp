# Green Cycle — Improvement

All tests are passing. Choose ONE improvement activity and execute it.

## Priority Order (pick the highest-priority item you haven't done recently)

1. **Add unit tests for litium-mine contract** (HIGHEST ROI — contract needs more test coverage)
   - Test emission curve math against the spec (7-component stepped decay)
   - Test difficulty adjustment logic (+/-25% per epoch, target 100 solutions)
   - Test proof validation edge cases (invalid nonce, wrong block hash, expired epoch)
   - Test reward split logic (work/stake/referral shares at various alpha levels)
   - Test epoch transitions and boundary conditions
   - Follow existing test patterns in `contracts/litium-mine/src/contract.rs` (line ~1402)

2. **Add edge case tests to test-mining.mjs** (bostrom-mcp)
   - Test with invalid/malformed proofs
   - Test concurrent proof submissions
   - Test with expired block contexts
   - Test error messages for common failure modes

3. **Add tests for emission curve math** (verify against lithium.md spec)
   - Test each of the 7 components independently
   - Test the composite emission rate at key time points (day 1, 7, 30, 90, 365, 1461)
   - Verify cumulative emission matches the spec percentages
   - Test the main-to-tail phase transition

4. **Improve error messages and validation**
   - Better error messages when proof verification fails
   - Input validation for edge cases (zero nonce, empty block hash)
   - Clearer error types in ContractError enum

5. **Refactor duplicated code**
   - Only if you find clear duplication across the three repos
   - Keep changes minimal and well-tested

## Rules

- Pick exactly ONE activity per cycle
- Write tests that actually test meaningful behavior, not trivial getters
- Follow existing code style and test patterns in each repo
- Rebuild and run tests after your changes
- Output your result as the LAST line: `IMPROVED: <one-line summary of what you added/changed>`
