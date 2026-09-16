
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
FlowSplit

FlowSplit is a GenLayer contract for teams that share revenue.

It is made for groups like bands, newsletters, small creator teams, or open-source projects where the amount of work each person does can change over time.

Instead of keeping the same percentage forever, FlowSplit allows the team to review contributions and update the split.

How it works
Contributors register their wallet address.
The owner gives each contributor a starting percentage.
The percentages must add up to 100%.
A new contribution period is started.
Each contributor submits a short description of their work and a link to supporting evidence.
The period is closed.
The contract uses the submitted information and contribution scores to create a new proposed split.
The new split is checked before it is saved.
A contributor's percentage cannot move by more than 15 points in one rebalance.
A contributor can dispute the new split if they believe it is unfair.
Main functions
register_contributor()

Adds a contributor to the contract.

set_percentage()

Sets a contributor's current revenue percentage.

The total percentage cannot go above 100.

start_period()

Starts a new contribution period.

The current split must already equal 100%.

submit_evidence()

A contributor submits:

What they worked on
A URL showing supporting evidence
record_evaluation()

The owner can record a contribution score from 0 to 100.

end_period()

Closes the current contribution period.

rebalance()

Creates a new proposed split using the contribution information.

Before the new percentages are saved, the contract checks that:

Every contributor is included
Percentages are valid
The total equals 100
No percentage changes by more than 15 points

If any check fails, the new split is not saved.

dispute_rebalance()

A contributor can flag a rebalance and give a reason.

resolve_dispute()

The owner can resolve a dispute and, if needed, restore the previous percentages.

Checking the contract

The contract includes read-only functions for checking things such as:

Current period
Number of contributors
Current percentages
Previous percentages
Submitted evidence
Contribution scores
Disputes
The latest proposed split

There is also get_full_split() for viewing the complete current split.

Why FlowSplit?

Revenue sharing can become difficult when people's roles change.

Someone may do much more work in one month and much less the next. A fixed agreement doesn't handle that very well.

FlowSplit gives the team a way to review the work done during each period and adjust the percentages while keeping limits in place.

Current limitations

This version deals with percentage accounting only. It does not send the actual revenue or GEN to contributors.

Also, the contract stores the evidence URL but does not currently fetch the page itself to verify it.

Built with
GenLayer
Python
GenLayer Storage
GenLayer Equivalence Principle
Project status

FlowSplit is a working prototype focused on dynamic revenue splits based on contribution records.

The next step would be connecting the percentages to actual payments and improving how submitted evidence is checked.
>>>>>>> f259e103d3b193f0a499ec5d339f4d5e1baec3c6
