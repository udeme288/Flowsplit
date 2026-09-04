FlowSplit

FlowSplit is a GenLayer Intelligent Contract designed for teams that share ongoing revenue — like bands, newsletters, creators, or open-source projects.

The problem is simple: contribution levels change, but revenue splits usually don't. FlowSplit allows the split to be reviewed and rebalanced based on what each contributor actually did during a specific period.

How it works
Contributors register their wallet addresses.
An initial revenue percentage is assigned to each contributor.
A contribution period is opened.
Contributors submit evidence + a source URL describing their work.
The period is closed.
rebalance() sends the contribution data to GenLayer's AI-validator consensus.
Validators independently evaluate the contributions and reach an agreed interpretation of a fair new split.
The new percentages are applied, with a 15-point maximum movement per period to reduce extreme or manipulated results.
Contributors can dispute the result if they believe the rebalance is unfair.
Why GenLayer?

A traditional smart contract is good at deterministic rules, but it can't easily answer subjective questions like:

"Was this contribution actually valuable to the project?"

FlowSplit uses GenLayer's Equivalence Principle and LLM-based validators to evaluate this type of unstructured information and reach consensus.

So the contract combines:

on-chain rules + contributor evidence + AI evaluation + validator consensus = dynamic revenue splitting.

Current version

The current version tracks the revenue percentages but doesn't transfer the actual GEN/revenue yet. Evidence is also submitted as text and a URL; future versions can use GenLayer's web capabilities to fetch and verify the linked evidence directly.

The main idea: FlowSplit turns a fixed revenue agreement into a system that can adapt to the work people are actually doing.
