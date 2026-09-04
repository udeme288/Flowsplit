# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


class FlowSplit(gl.Contract):

    owner: Address

    period: u256
    rebalance_count: u256
    contributor_count: u256
    total_percentage: u256

    period_active: bool
    period_rebalanced: bool

    contributors: TreeMap[Address, bool]
    percentages: TreeMap[Address, u256]
    previous_percentages: TreeMap[Address, u256]

    evidence: TreeMap[Address, str]
    evidence_source: TreeMap[Address, str]

    evaluation_score: TreeMap[Address, u256]
    evaluation_status: TreeMap[Address, bool]

    dispute_flag: TreeMap[Address, bool]
    dispute_reason: TreeMap[Address, str]

    ai_proposal_raw: str

    def __init__(self):
        self.owner = gl.message.sender_address

        self.period = u256(0)
        self.rebalance_count = u256(0)
        self.contributor_count = u256(0)
        self.total_percentage = u256(0)

        self.period_active = False
        self.period_rebalanced = False

        self.contributors = gl.storage.inmem_allocate(TreeMap[Address, bool])
        self.percentages = gl.storage.inmem_allocate(TreeMap[Address, u256])
        self.previous_percentages = gl.storage.inmem_allocate(TreeMap[Address, u256])

        self.evidence = gl.storage.inmem_allocate(TreeMap[Address, str])
        self.evidence_source = gl.storage.inmem_allocate(TreeMap[Address, str])

        self.evaluation_score = gl.storage.inmem_allocate(TreeMap[Address, u256])
        self.evaluation_status = gl.storage.inmem_allocate(TreeMap[Address, bool])

        self.dispute_flag = gl.storage.inmem_allocate(TreeMap[Address, bool])
        self.dispute_reason = gl.storage.inmem_allocate(TreeMap[Address, str])

        self.ai_proposal_raw = ""

    # ---------------- views ----------------

    @gl.public.view
    def get_owner(self) -> str:
        return str(self.owner)

    @gl.public.view
    def get_period(self) -> int:
        return int(self.period)

    @gl.public.view
    def get_rebalance_count(self) -> int:
        return int(self.rebalance_count)

    @gl.public.view
    def get_contributor_count(self) -> int:
        return int(self.contributor_count)

    @gl.public.view
    def get_total_percentage(self) -> int:
        return int(self.total_percentage)

    @gl.public.view
    def is_period_active(self) -> bool:
        return self.period_active

    @gl.public.view
    def has_period_rebalanced(self) -> bool:
        return self.period_rebalanced

    @gl.public.view
    def is_contributor(self, contributor: Address) -> bool:
        return self.contributors.get(contributor, False)

    @gl.public.view
    def get_percentage(self, contributor: Address) -> int:
        return int(self.percentages.get(contributor, u256(0)))

    @gl.public.view
    def get_previous_percentage(self, contributor: Address) -> int:
        return int(self.previous_percentages.get(contributor, u256(0)))

    @gl.public.view
    def get_evidence(self, contributor: Address) -> str:
        return self.evidence.get(contributor, "")

    @gl.public.view
    def get_evidence_source(self, contributor: Address) -> str:
        return self.evidence_source.get(contributor, "")

    @gl.public.view
    def get_evaluation_score(self, contributor: Address) -> int:
        return int(self.evaluation_score.get(contributor, u256(0)))

    @gl.public.view
    def has_evaluation(self, contributor: Address) -> bool:
        return self.evaluation_status.get(contributor, False)

    @gl.public.view
    def is_disputed(self, contributor: Address) -> bool:
        return self.dispute_flag.get(contributor, False)

    @gl.public.view
    def get_dispute_reason(self, contributor: Address) -> str:
        return self.dispute_reason.get(contributor, "")

    @gl.public.view
    def get_ai_proposal(self) -> str:
        return self.ai_proposal_raw

    @gl.public.view
    def get_full_split(self) -> str:
        result = {}
        for c in self.contributors:
            result[str(c)] = int(self.percentages.get(c, u256(0)))
        return json.dumps(result)

    # ---------------- setup ----------------

    @gl.public.write
    def register_contributor(self) -> None:
        contributor = gl.message.sender_address

        if self.contributors.get(contributor, False):
            raise gl.vm.UserError("Already registered")

        self.contributors[contributor] = True
        self.percentages[contributor] = u256(0)
        self.previous_percentages[contributor] = u256(0)

        self.evidence[contributor] = ""
        self.evidence_source[contributor] = ""

        self.evaluation_score[contributor] = u256(0)
        self.evaluation_status[contributor] = False

        self.dispute_flag[contributor] = False
        self.dispute_reason[contributor] = ""

        self.contributor_count = self.contributor_count + u256(1)

    @gl.public.write
    def set_percentage(self, contributor: Address, percentage: int) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can set percentages")

        if not self.contributors.get(contributor, False):
            raise gl.vm.UserError("Contributor is not registered")

        if percentage < 0 or percentage > 100:
            raise gl.vm.UserError("Percentage must be between 0 and 100")

        old_percentage = int(self.percentages.get(contributor, u256(0)))
        new_total = int(self.total_percentage) - old_percentage + percentage

        if new_total > 100:
            raise gl.vm.UserError("Total percentage cannot exceed 100")

        self.percentages[contributor] = u256(percentage)
        self.total_percentage = u256(new_total)

    # ---------------- period lifecycle ----------------

    @gl.public.write
    def start_period(self) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can start a period")

        if self.period_active:
            raise gl.vm.UserError("A period is already active")

        if int(self.total_percentage) != 100:
            raise gl.vm.UserError("Percentages must total 100")

        self.period = self.period + u256(1)
        self.period_active = True
        self.period_rebalanced = False

        for contributor in self.contributors:
            self.evidence[contributor] = ""
            self.evidence_source[contributor] = ""

            self.evaluation_score[contributor] = u256(0)
            self.evaluation_status[contributor] = False

            self.dispute_flag[contributor] = False
            self.dispute_reason[contributor] = ""

    @gl.public.write
    def submit_evidence(self, contribution_evidence: str, source_url: str) -> None:
        contributor = gl.message.sender_address

        if not self.contributors.get(contributor, False):
            raise gl.vm.UserError("Contributor is not registered")

        if not self.period_active:
            raise gl.vm.UserError("No active period")

        if len(contribution_evidence) == 0:
            raise gl.vm.UserError("Evidence cannot be empty")

        if len(source_url) == 0:
            raise gl.vm.UserError("Source URL cannot be empty")

        self.evidence[contributor] = contribution_evidence
        self.evidence_source[contributor] = source_url

        self.evaluation_score[contributor] = u256(0)
        self.evaluation_status[contributor] = False

    @gl.public.write
    def record_evaluation(self, contributor: Address, score: int) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can record evaluations")

        if self.period_active:
            raise gl.vm.UserError("End the period before evaluation")

        if not self.contributors.get(contributor, False):
            raise gl.vm.UserError("Contributor is not registered")

        if score < 0 or score > 100:
            raise gl.vm.UserError("Evaluation score out of range")

        self.evaluation_score[contributor] = u256(score)
        self.evaluation_status[contributor] = True

    @gl.public.write
    def end_period(self) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can end a period")

        if not self.period_active:
            raise gl.vm.UserError("No active period")

        self.period_active = False

    # ---------------- AI-judged rebalance ----------------

    @gl.public.write
    def rebalance(self) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can rebalance")

        if self.period_active:
            raise gl.vm.UserError("End the period before rebalancing")

        if self.period_rebalanced:
            raise gl.vm.UserError("This period has already been rebalanced")

        current_split = {}
        lines = []
        for contributor in self.contributors:
            addr_str = str(contributor)
            pct = int(self.percentages.get(contributor, u256(0)))
            score = int(self.evaluation_score.get(contributor, u256(0)))
            ev = self.evidence.get(contributor, "")
            src = self.evidence_source.get(contributor, "")
            current_split[addr_str] = pct
            lines.append(
                f"{addr_str} | current {pct}% | evaluation score {score}/100 "
                f"| evidence: {ev} | source: {src}"
            )

        context = (
            "Current split (JSON): " + json.dumps(current_split) + "\n\n"
            "Contributor activity this period:\n" + "\n".join(lines)
        )

        def get_input() -> str:
            return context

        proposal_json = gl.eq_principle.prompt_non_comparative(
            get_input,
            task="""
                Propose an updated percentage split reflecting each
                contributor's actual work this period, based on the
                evidence provided. Respond with ONLY a JSON object mapping
                each contributor's address (exactly as given) to an
                integer percentage.
            """,
            criteria="""
                The response is valid JSON and nothing else
                It maps every contributor address from the input to an integer
                The integers sum to exactly 100
                No contributor's percentage changed by more than 15 points
                from their current percentage shown in the input
            """,
        )

        proposal = json.loads(proposal_json)

        for contributor in self.contributors:
            self.previous_percentages[contributor] = self.percentages.get(
                contributor, u256(0)
            )

        new_total = 0
        for contributor in self.contributors:
            addr_str = str(contributor)
            pct = int(proposal.get(addr_str, current_split.get(addr_str, 0)))
            if pct < 0 or pct > 100:
                raise gl.vm.UserError("AI proposal contained an out-of-range percentage")
            self.percentages[contributor] = u256(pct)
            new_total = new_total + pct

        self.total_percentage = u256(new_total)
        self.ai_proposal_raw = proposal_json
        self.rebalance_count = self.rebalance_count + u256(1)
        self.period_rebalanced = True

    # ---------------- dispute path ----------------

    @gl.public.write
    def dispute_rebalance(self, reason: str) -> None:
        contributor = gl.message.sender_address

        if not self.contributors.get(contributor, False):
            raise gl.vm.UserError("Contributor is not registered")

        if not self.period_rebalanced:
            raise gl.vm.UserError("No rebalance to dispute yet")

        if len(reason) == 0:
            raise gl.vm.UserError("Reason cannot be empty")

        self.dispute_flag[contributor] = True
        self.dispute_reason[contributor] = reason

    @gl.public.write
    def resolve_dispute(self, contributor: Address, revert_split: bool) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("Only the owner can resolve disputes")

        if not self.dispute_flag.get(contributor, False):
            raise gl.vm.UserError("No active dispute for this contributor")

        if revert_split:
            new_total = 0
            for c in self.contributors:
                restored = self.previous_percentages.get(c, u256(0))
                self.percentages[c] = restored
                new_total = new_total + int(restored)
            self.total_percentage = u256(new_total)

        self.dispute_flag[contributor] = False
        self.dispute_reason[contributor] = ""