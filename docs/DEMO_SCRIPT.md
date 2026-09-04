# Demo Script

Use this as your recording script — it's built to show the AI-judged
rebalance actually working, which is the part judges care about most.

## Setup (do this before recording)

1. Deploy `FlowSplit.py` in GenLayer Studio.
2. Switch to Account A (owner) — this account deployed the contract, so
   it's automatically the owner.
3. Call `register_contributor()` as Account A.
4. Switch to Account B, call `register_contributor()`.
5. Switch back to Account A, call:
   - `set_percentage(<Account A address>, 60)`
   - `set_percentage(<Account B address>, 40)`
6. Call `start_period()`.

## Recording (2-3 minutes is plenty)

1. **Open with the problem** (10s): "Fixed revenue splits go stale the
   moment effort shifts. FlowSplit re-judges the split itself."
2. **Show the setup** (20s): call `get_full_split()` — show it returns
   `{"A": 60, "B": 40}`.
3. **Submit evidence** (30s):
   - As Account A: `submit_evidence("Wrote 3 posts, edited newsletter", "https://github.com/yourrepo/commits")`
   - As Account B: `submit_evidence("Landed a sponsorship deal, tripled subscribers", "https://yourlink.com/campaign-report")`
4. **Close the period** (10s): as Account A, call `end_period()`.
5. **The key moment** (30-60s): call `rebalance()`. Narrate while it runs:
   "This is calling out to GenLayer's validators right now — they're
   independently reading both contributors' evidence and proposing an
   updated split." Once it resolves, call `get_full_split()` again and
   show the numbers changed (e.g. B's share went up).
6. **Show the audit trail** (15s): call `get_ai_proposal()` — show the raw
   AI reasoning/output is stored on-chain, not just the final numbers.
7. **Show the dispute path** (20s): as Account A, call
   `dispute_rebalance("B's report wasn't independently verified")`, then
   show `is_disputed(<Account A address>)` returns true. Mention
   `resolve_dispute()` as the owner's resolution step.
8. **Close** (10s): state what you'd build next — real GEN payouts and
   web-verified evidence (see README's "Known limitations").

## If something errors during the live demo

- **"End the period before rebalancing"** → you forgot `end_period()`.
- **"This period has already been rebalanced"** → call `start_period()`
  again to open a new one (only after registering percentages still sum
  to 100).
- **`rebalance()` hangs or times out** → Studio's local validators are
  simulating LLM calls; give it a few extra seconds before assuming it's
  broken.
