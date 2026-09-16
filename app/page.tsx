"use client";

import { useMemo, useState } from "react";
import { connectRabby } from "../lib/rabby";

type Contributor = {
  id: string;
  name: string;
  role: string;
  percentage: number;
  previousPercentage: number;
  evidence: string;
  evidenceSource: string;
};

type Team = {
  name: string;
  type: string;
  description: string;
};

const initialContributors: Contributor[] = [
  {
    id: "writer",
    name: "Newsletter Writer",
    role: "Content",
    percentage: 60,
    previousPercentage: 60,
    evidence:
      "Created the weekly newsletter content, researched topics, and maintained the publishing schedule.",
    evidenceSource: "https://example.com/writer-evidence",
  },
  {
    id: "editor",
    name: "Editor",
    role: "Editorial",
    percentage: 25,
    previousPercentage: 25,
    evidence:
      "Reviewed newsletter drafts, improved structure, corrected errors, and prepared final editions.",
    evidenceSource: "https://example.com/editor-evidence",
  },
  {
    id: "growth",
    name: "Growth",
    role: "Growth",
    percentage: 15,
    previousPercentage: 15,
    evidence:
      "Worked on audience growth, distribution, partnerships, and newsletter promotion.",
    evidenceSource: "https://example.com/growth-evidence",
  },
];

const teamTypes = [
  {
    name: "Music / Band",
    icon: "♪",
    description: "Bands, artists and music teams",
  },
  {
    name: "Creative",
    icon: "✦",
    description: "Designers, creators and agencies",
  },
  {
    name: "Media",
    icon: "◉",
    description: "Newsletters, podcasts and media",
  },
  {
    name: "Startup",
    icon: "↗",
    description: "Founders and project teams",
  },
  {
    name: "Open Source",
    icon: "⌘",
    description: "Developers and contributors",
  },
  {
    name: "Other",
    icon: "＋",
    description: "Any team with shared revenue",
  },
];

export default function Home() {
  const [team, setTeam] = useState<Team>({
    name: "Newsletter Team",
    type: "Media",
    description: "A collaborative newsletter team.",
  });

  const [contributors, setContributors] =
    useState<Contributor[]>(initialContributors);

  const [walletAddress, setWalletAddress] = useState("");
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState("");

  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamType, setNewTeamType] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const [selectedContributor, setSelectedContributor] = useState(
    initialContributors[0].id
  );
  const [evidence, setEvidence] = useState("");
  const [evidenceSource, setEvidenceSource] = useState("");
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const totalPercentage = useMemo(
    () =>
      contributors.reduce(
        (total, contributor) => total + contributor.percentage,
        0
      ),
    [contributors]
  );

  const walletConnected = Boolean(walletAddress);

  async function handleConnectWallet() {
    setWalletError("");
    setWalletConnecting(true);

    try {
      const result = await connectRabby();
      setWalletAddress(result.address);
    } catch (error) {
      setWalletError(
        error instanceof Error
          ? error.message
          : "Unable to connect Rabby wallet."
      );
    } finally {
      setWalletConnecting(false);
    }
  }

  function handleDisconnectWallet() {
    setWalletAddress("");
    setWalletError("");
  }

  function shortenAddress(address: string) {
    if (address.length < 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function openSetup() {
    setSetupStep(1);
    setNewTeamName("");
    setNewTeamType("");
    setNewTeamDescription("");
    setShowSetup(true);
  }

  function createTeam() {
    if (!newTeamName.trim() || !newTeamType) return;

    setTeam({
      name: newTeamName.trim(),
      type: newTeamType,
      description:
        newTeamDescription.trim() ||
        `${newTeamType} team using FlowSplit for contribution-based revenue sharing.`,
    });

    setShowSetup(false);
    setSuccessMessage("Your FlowSplit team has been created.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  function loadBandExample() {
    setTeam({
      name: "The Harmony Band",
      type: "Music / Band",
      description: "A four-member music group sharing revenue by contribution.",
    });

    setContributors([
      {
        id: "singer",
        name: "Sarah",
        role: "Singer",
        percentage: 35,
        previousPercentage: 35,
        evidence:
          "Recorded vocals for four tracks, wrote lyrics for two songs and handled promotional appearances.",
        evidenceSource: "https://example.com/singer-evidence",
      },
      {
        id: "guitarist",
        name: "David",
        role: "Guitarist",
        percentage: 25,
        previousPercentage: 25,
        evidence:
          "Recorded guitar parts for four songs, performed at three shows and contributed to song arrangements.",
        evidenceSource: "https://example.com/guitarist-evidence",
      },
      {
        id: "drummer",
        name: "James",
        role: "Drummer",
        percentage: 20,
        previousPercentage: 20,
        evidence:
          "Recorded drums for four tracks and performed at three live shows during the period.",
        evidenceSource: "https://example.com/drummer-evidence",
      },
      {
        id: "producer",
        name: "Chris",
        role: "Producer",
        percentage: 20,
        previousPercentage: 20,
        evidence:
          "Produced and mixed four tracks and coordinated the band's recording sessions.",
        evidenceSource: "https://example.com/producer-evidence",
      },
    ]);

    setSuccessMessage("Band example loaded.");

    setTimeout(() => setSuccessMessage(""), 3000);
  }

  function handleSubmitEvidence() {
    if (!evidence.trim()) return;

    setContributors((current) =>
      current.map((contributor) =>
        contributor.id === selectedContributor
          ? {
              ...contributor,
              evidence: evidence.trim(),
              evidenceSource:
                evidenceSource.trim() || contributor.evidenceSource,
            }
          : contributor
      )
    );

    setEvidence("");
    setEvidenceSource("");
    setShowEvidenceForm(false);
    setSuccessMessage("Contribution evidence submitted successfully.");

    setTimeout(() => setSuccessMessage(""), 3000);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050806] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[-15%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.035] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#050806]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <span className="text-lg font-bold text-emerald-300">F</span>
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight">FlowSplit</h1>

              <p className="hidden text-[11px] text-gray-500 sm:block">
                Contribution-based revenue sharing
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {walletConnected ? (
              <>
                <div className="hidden items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2 text-sm text-emerald-300 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {shortenAddress(walletAddress)}
                </div>

                <button
                  onClick={handleDisconnectWallet}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.07] sm:px-4 sm:text-sm"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={walletConnecting}
                className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#04100a] shadow-[0_0_30px_rgba(52,211,153,0.12)] hover:bg-emerald-300 disabled:opacity-50"
              >
                {walletConnecting ? "Connecting..." : "Connect Rabby"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-0 sm:px-6 lg:px-8">
        {walletError && <Alert type="error" message={walletError} />}

        {successMessage && (
          <Alert type="success" message={successMessage} />
        )}

        {/* Main Hero */}
        <section className="relative overflow-hidden rounded-b-[30px] rounded-t-none border-x border-b border-white/[0.08] bg-gradient-to-br from-[#0d1712] via-[#09100d] to-[#070a08] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute right-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full bg-emerald-400/[0.06] blur-[90px]" />

          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Built for teams that share revenue
            </div>

            <h2 className="text-3xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Your contribution
              <br />
              <span className="bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                should shape your share.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              FlowSplit helps bands, startups, creators, media teams and
              open-source projects adjust revenue shares as contributions
              change over time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={openSetup}
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#04100a] shadow-[0_0_35px_rgba(52,211,153,0.12)] hover:bg-emerald-300"
              >
                Create a Team →
              </button>

              <button
                onClick={loadBandExample}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-white/[0.07] hover:text-white"
              >
                See Band Example
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-600">
              {[
                "Music",
                "Creative",
                "Media",
                "Startup",
                "Open Source",
                "Other",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Current Team */}
        <div className="mb-5 mt-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Team Dashboard
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {team.name}
              </h3>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-400">
                {team.type}
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl text-sm text-gray-500">
              {team.description}
            </p>
          </div>

          <button
            onClick={openSetup}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/[0.07] hover:text-white"
          >
            + New Team
          </button>
        </div>

        {/* Overview */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Contributors"
            value={String(contributors.length)}
            description="Active team members"
            icon="◎"
          />

          <OverviewCard
            title="Current Split"
            value={`${totalPercentage}%`}
            description="Total allocation"
            icon="%"
          />

          <OverviewCard
            title="Period"
            value="#4"
            description="Current contribution period"
            icon="◷"
          />

          <OverviewCard
            title="Status"
            value="Review"
            description="Evidence being reviewed"
            icon="↗"
          />
        </section>

        {/* Revenue Split */}
        <section className="mt-6 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#090e0b]/90 shadow-xl">
          <div className="border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
                  Allocation
                </p>

                <h3 className="mt-1.5 text-xl font-bold">
                  Current Revenue Split
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  How the team's current revenue is allocated.
                </p>
              </div>

              <button
                onClick={() => setShowEvidenceForm(true)}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-gray-200"
              >
                + Submit Evidence
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
              {contributors.map((contributor, index) => (
                <div
                  key={contributor.id}
                  style={{ width: `${contributor.percentage}%` }}
                  className={
                    index === 0
                      ? "bg-emerald-400"
                      : index === 1
                        ? "bg-emerald-400/60"
                        : "bg-emerald-400/30"
                  }
                />
              ))}
            </div>

            <div className="space-y-2.5">
              {contributors.map((contributor) => (
                <ContributorRow
                  key={contributor.id}
                  contributor={contributor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#090e0b]/90 p-5 shadow-xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
            Workflow
          </p>

          <h3 className="mt-1.5 text-xl font-bold">Period Status</h3>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <StatusStep
              number="01"
              title="Period Started"
              description="Contribution period is active."
              completed
            />

            <StatusStep
              number="02"
              title="Evidence Submitted"
              description="Team members provide contribution evidence."
              completed
            />

            <StatusStep
              number="03"
              title="Validator Review"
              description="Evidence is reviewed before a rebalance."
              active
            />

            <StatusStep
              number="04"
              title="Rebalance"
              description="Approved changes update the revenue split."
            />
          </div>
        </section>

        {/* Evidence */}
        <section className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
            Proof of contribution
          </p>

          <h3 className="mt-1.5 text-xl font-bold">
            Contribution Evidence
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Evidence submitted by members of {team.name}.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {contributors.map((contributor) => (
              <EvidenceCard
                key={contributor.id}
                contributor={contributor}
              />
            ))}
          </div>
        </section>

        {/* Proposal */}
        <section className="mt-7 rounded-[24px] border border-emerald-400/[0.12] bg-gradient-to-br from-[#0b1510] to-[#080c0a] p-5 shadow-[0_20px_70px_rgba(16,185,129,0.04)] sm:p-6">
          <div className="mb-5">
            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
              Proposed Rebalance
            </span>

            <h3 className="mt-3 text-xl font-bold">
              Contribution-based allocation
            </h3>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
              The proposed split shows how revenue could change after
              reviewing contribution evidence for this period.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {contributors.slice(0, 3).map((contributor, index) => {
              const proposed =
                index === 0
                  ? Math.max(5, contributor.percentage - 5)
                  : index === 1
                    ? Math.max(5, contributor.percentage - 5)
                    : contributor.percentage + 10;

              return (
                <ProposalCard
                  key={contributor.id}
                  name={contributor.name}
                  oldValue={contributor.percentage}
                  newValue={proposed}
                />
              );
            })}
          </div>
        </section>

        {/* Verification */}
        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#090e0b]/90 p-5 shadow-xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
            Validation Layer
          </p>

          <h3 className="mt-1.5 text-xl font-bold">
            Validator Verification
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Checks before a proposed rebalance can be accepted.
          </p>

          <div className="mt-4 space-y-2.5">
            <VerificationItem
              title="Split totals 100%"
              description="The proposed contributor percentages add up to 100%."
              passed
            />

            <VerificationItem
              title="Contribution evidence submitted"
              description="Each contributor has supporting evidence recorded."
              passed
            />

            <VerificationItem
              title="Evidence justification"
              description="The proposed changes should be supported by submitted contribution evidence."
              passed={false}
            />

            <VerificationItem
              title="Validator review"
              description="The proposed rebalance is awaiting validator verification."
              passed={false}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/[0.06] py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-gray-300">
                FlowSplit
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Dynamic revenue sharing based on contribution.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              GenLayer Studio Next · Chain 61997
            </div>
          </div>
        </footer>
      </div>

      {/* Create Team Modal */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/[0.1] bg-[#0a0f0c] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="border-b border-white/[0.07] p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
                    Create a team
                  </p>

                  <h3 className="mt-1.5 text-2xl font-bold">
                    Set up your FlowSplit
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Your team can be a band, startup, creator group, or
                    anything else.
                  </p>
                </div>

                <button
                  onClick={() => setShowSetup(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-gray-500 hover:bg-white/[0.06] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full ${
                      setupStep >= step
                        ? "bg-emerald-400"
                        : "bg-white/[0.07]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {setupStep === 1 && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-300">
                    What kind of team are you creating?
                  </p>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {teamTypes.map((type) => (
                      <button
                        key={type.name}
                        onClick={() => {
                          setNewTeamType(type.name);
                          setSetupStep(2);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${
                          newTeamType === type.name
                            ? "border-emerald-400/30 bg-emerald-400/[0.07]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-emerald-400/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-lg text-emerald-300">
                            {type.icon}
                          </span>

                          <div>
                            <p className="font-semibold text-gray-200">
                              {type.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {setupStep === 2 && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Team name
                  </label>

                  <input
                    value={newTeamName}
                    onChange={(event) =>
                      setNewTeamName(event.target.value)
                    }
                    placeholder="e.g. The Harmony Band"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-emerald-400/40"
                    autoFocus
                  />

                  <label className="mb-2 mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Short description
                  </label>

                  <textarea
                    value={newTeamDescription}
                    onChange={(event) =>
                      setNewTeamDescription(event.target.value)
                    }
                    rows={3}
                    placeholder="What does your team do?"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-emerald-400/40"
                  />

                  <div className="mt-5 flex justify-between">
                    <button
                      onClick={() => setSetupStep(1)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => setSetupStep(3)}
                      disabled={!newTeamName.trim()}
                      className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#04100a] hover:bg-emerald-300 disabled:opacity-30"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {setupStep === 3 && (
                <div>
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-emerald-400">
                      Ready to create
                    </p>

                    <h4 className="mt-1.5 text-xl font-bold">
                      {newTeamName}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {newTeamType}
                    </p>

                    {newTeamDescription && (
                      <p className="mt-3 text-sm leading-6 text-gray-400">
                        {newTeamDescription}
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    After creating the team, you can add contributors, define
                    their initial revenue shares, and begin collecting
                    contribution evidence.
                  </p>

                  <div className="mt-5 flex justify-between">
                    <button
                      onClick={() => setSetupStep(2)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    >
                      Back
                    </button>

                    <button
                      onClick={createTeam}
                      className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#04100a] hover:bg-emerald-300"
                    >
                      Create Team
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0b100d] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="border-b border-white/[0.07] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                    Contribution proof
                  </p>

                  <h3 className="mt-1.5 text-xl font-bold">
                    Submit Contribution Evidence
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Add evidence showing what the contributor worked on during
                    this period.
                  </p>
                </div>

                <button
                  onClick={() => setShowEvidenceForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-gray-500 hover:bg-white/[0.06] hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Contributor
                </label>

                <select
                  value={selectedContributor}
                  onChange={(event) =>
                    setSelectedContributor(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/40"
                >
                  {contributors.map((contributor) => (
                    <option
                      key={contributor.id}
                      value={contributor.id}
                      className="bg-[#0b100d]"
                    >
                      {contributor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Contribution Evidence
                </label>

                <textarea
                  value={evidence}
                  onChange={(event) => setEvidence(event.target.value)}
                  rows={4}
                  placeholder="Describe what was done and how it contributed..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-emerald-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Evidence Source
                </label>

                <input
                  value={evidenceSource}
                  onChange={(event) =>
                    setEvidenceSource(event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-emerald-400/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/[0.07] p-5">
              <button
                onClick={() => setShowEvidenceForm(false)}
                className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitEvidence}
                disabled={!evidence.trim()}
                className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#04100a] hover:bg-emerald-300 disabled:opacity-30"
              >
                Submit Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Alert({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`mb-4 flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm ${
        type === "success"
          ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
          : "border-red-400/15 bg-red-400/[0.06] text-red-300"
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05]">
        {type === "success" ? "✓" : "!"}
      </span>

      {message}
    </div>
  );
}

function OverviewCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#090e0b]/90 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/15">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
          {title}
        </p>

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-xs text-gray-500 group-hover:text-emerald-300">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-gray-600">{description}</p>
    </div>
  );
}

function ContributorRow({
  contributor,
}: {
  contributor: Contributor;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-sm font-bold text-emerald-300">
          {contributor.name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-gray-200">
            {contributor.name}
          </p>

          <p className="mt-0.5 text-xs text-gray-600">
            {contributor.role}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:block sm:text-right">
        <p className="text-2xl font-bold">{contributor.percentage}%</p>

        <p className="text-xs text-gray-600 sm:mt-0.5">
          Previous {contributor.previousPercentage}%
        </p>
      </div>
    </div>
  );
}

function StatusStep({
  number,
  title,
  description,
  completed = false,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  completed?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.035]"
          : "border-white/[0.06] bg-white/[0.018]"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold ${
          completed
            ? "bg-emerald-400/15 text-emerald-300"
            : active
              ? "bg-yellow-400/10 text-yellow-300"
              : "bg-white/[0.05] text-gray-600"
        }`}
      >
        {completed ? "✓" : number}
      </div>

      <p className="mt-4 font-semibold text-gray-200">{title}</p>

      <p className="mt-1.5 text-sm leading-5 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function EvidenceCard({
  contributor,
}: {
  contributor: Contributor;
}) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#090e0b]/90 p-4 transition hover:-translate-y-1 hover:border-emerald-400/15">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.07] text-xs font-bold text-emerald-300">
          {contributor.name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-gray-200">
            {contributor.name}
          </p>

          <p className="mt-0.5 text-xs text-gray-600">
            {contributor.role}
          </p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-5 text-gray-500">
        {contributor.evidence}
      </p>

      <a
        href={contributor.evidenceSource}
        target="_blank"
        rel="noreferrer"
        className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
      >
        View evidence source →
      </a>
    </div>
  );
}

function ProposalCard({
  name,
  oldValue,
  newValue,
}: {
  name: string;
  oldValue: number;
  newValue: number;
}) {
  const change = newValue - oldValue;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <p className="text-sm font-semibold text-gray-300">{name}</p>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-sm text-gray-600">{oldValue}%</span>

        <span className="text-gray-700">→</span>

        <span className="text-3xl font-bold">{newValue}%</span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-emerald-400/60"
          style={{ width: `${Math.min(newValue, 100)}%` }}
        />
      </div>

      <p
        className={`mt-2 text-xs font-medium ${
          change >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change}% proposed change
      </p>
    </div>
  );
}

function VerificationItem({
  title,
  description,
  passed,
}: {
  title: string;
  description: string;
  passed: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-3.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
          passed
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-yellow-400/[0.08] text-yellow-300"
        }`}
      >
        {passed ? "✓" : "!"}
      </div>

      <div>
        <p className="font-semibold text-gray-200">{title}</p>

        <p className="mt-0.5 text-sm leading-5 text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}