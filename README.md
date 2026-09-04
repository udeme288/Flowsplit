# FlowSplit

**A revenue-split contract that renegotiates itself.**

FlowSplit is a GenLayer Intelligent Contract for teams who share ongoing
revenue — a band, a newsletter, a small open-source project — but whose
contribution levels shift over time. Instead of a fixed split agreed once
and never revisited, FlowSplit periodically judges what each contributor
actually did and proposes an updated split, using GenLayer's AI-validator
consensus instead of a human arbiter.

## Why this needs GenLayer specifically

A normal smart contract can enforce a fixed split, or require a manual
vote to change it. It cannot **read unstructured evidence of work** (a
commit history, a published article, a campaign report) **and judge**
whether it justifies a different split. That's a subjective call, not a
deterministic one — which is exactly the gap GenLayer's validators (an
LLM-based consensus layer) are built to fill.

FlowSplit's `rebalance()` function:
1. Reads each contributor's submitted evidence for the period.
2. Passes it to GenLayer's `eq_principle.prompt_non_comparative`, where
   independent validators independently judge a fair updated split.
3. Applies the result on-chain — capped so no single contributor's share
   can swing by more than 15 points in one period, to prevent wild or
   gamed outcomes.

## What's in this repo

- `contracts/FlowSplit.py` — the Intelligent Contract, ready to paste into
  [GenLayer Studio](https://studio.genlayer.com) or deploy via the CLI.
- `docs/DEMO_SCRIPT.md` — a step-by-step walkthrough for recording a demo
  video or for judges testing it live.

## How it works, end to end

1. **`register_contributor()`** — each team member registers their address.
2. **`set_percentage(contributor, percentage)`** — the owner sets the
   starting split (must total 100).
3. **`start_period()`** — opens a new evidence-collection window.
4. **`submit_evidence(contribution_evidence, source_url)`** — each
   contributor describes what they did and links proof (a commit, a
   published post, a campaign report).
5. **`record_evaluation(contributor, score)`** *(optional)* — the owner can
   attach a 0–100 activity score per contributor before rebalancing, giving
   the AI validators an extra signal.
6. **`end_period()`** — closes the window.
7. **`rebalance()`** — triggers the AI-judged split proposal and applies it.
8. **`dispute_rebalance(reason)`** — any contributor can flag the new split
   as unfair.
9. **`resolve_dispute(contributor, revert_split)`** — the owner can revert
   to the previous period's split if a dispute is upheld.

Read-only helpers (`get_full_split()`, `get_ai_proposal()`,
`get_previous_percentage()`) expose full state for a frontend or for judges
inspecting the contract directly.

## Deploying it yourself

**Studio (fastest):**
1. Open [studio.genlayer.com](https://studio.genlayer.com).
2. Create a new contract, paste in `contracts/FlowSplit.py`.
3. Deploy with no constructor arguments.
4. Call `register_contributor()` from 2–3 different test accounts (Studio
   lets you switch the active account).
5. Follow `docs/DEMO_SCRIPT.md` from there.

**CLI:**
```bash
genlayer network set testnet-bradbury   # or your target network
genlayer deploy --contract contracts/FlowSplit.py
```

## Known limitations (be upfront about these with judges)

- Payouts are tracked as percentages only — this version doesn't move real
  GEN between addresses yet. That's the natural next step, using
  `@gl.public.write.payable` and `emit_transfer()`.
- The dispute path is a simple owner-resolved flag, not GenLayer's native
  on-chain appeal process — a v2 could route disputes through actual
  re-validation instead.
- Evidence is self-reported text + a URL, not independently fetched and
  verified by the contract yet (a natural extension: use
  `gl.nondet.web.get()` to pull and verify the linked page during
  `rebalance()`).
