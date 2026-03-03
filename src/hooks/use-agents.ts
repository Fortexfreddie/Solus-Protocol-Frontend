import useSWR from "swr";
import { getAgents, getAgentBalance, getPrices, getLeaderboard, type AgentSummary, type LeaderboardEntry } from "@/lib/api";
import type { Agent, AgentId, PipelineStep } from "@/types";

const AGENT_NAMES: Record<string, string> = {
    rex: "Agent Rex",
    nova: "Agent Nova",
    sage: "Agent Sage",
};

const DEFAULT_PIPELINE: PipelineStep[] = [
    { id: "price", label: "Price Oracle", status: "pending" },
    { id: "signal", label: "Signal Analysis (L1b)", status: "pending" },
    { id: "strategist", label: "Strategist (DeepSeek)", status: "pending" },
    { id: "guardian", label: "Guardian (Gemini)", status: "pending" },
    { id: "policy", label: "Policy Engine (9 checks)", status: "pending" },
    { id: "proof", label: "Proof-of-Reasoning", status: "pending" },
    { id: "vault", label: "Vault Sign (AES-256)", status: "pending" },
];

function truncateKey(key: string): string {
    if (key.length <= 10) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

async function fetchAgentsWithBalances(): Promise<Agent[]> {
    // Fetch agents, balances, prices, and leaderboard in parallel
    const [agentsRes, pricesRes, leaderboardRes] = await Promise.all([
        getAgents(),
        getPrices().catch(() => null),
        getLeaderboard().catch(() => null),
    ]);

    const { agents } = agentsRes;

    // Live SOL price from the prices endpoint
    const solPrice = pricesRes?.prices?.prices?.SOL?.usd ?? 0;

    // Leaderboard has the most accurate PnL data (computed server-side)
    const leaderboardMap = new Map<string, LeaderboardEntry>();
    if (leaderboardRes?.leaderboard) {
        for (const entry of leaderboardRes.leaderboard) {
            leaderboardMap.set(entry.agentId, entry);
        }
    }

    // Fetch balances in parallel
    const balanceResults = await Promise.allSettled(
        agents.map((a) => getAgentBalance(a.agentId))
    );

    return agents.map((agent, i): Agent => {
        const balResult = balanceResults[i];
        const balance =
            balResult?.status === "fulfilled" ? balResult.value.balance : null;

        const solBalance = balance?.sol ?? 0;
        const usdcBalance = balance?.tokens?.USDC ?? 0;

        // Use leaderboard data for accurate PnL (server-computed with all tokens)
        const lb = leaderboardMap.get(agent.agentId);
        const equity = lb?.liveValueUsd ?? (solBalance * solPrice + usdcBalance);
        const netPnLUsd = lb?.netPnLUsd ?? 0;
        const baselineUsd = lb?.baselineUsd ?? 0;
        const pnlPercent = baselineUsd > 0 ? (netPnLUsd / baselineUsd) * 100 : 0;

        return {
            id: agent.agentId as AgentId,
            name: AGENT_NAMES[agent.agentId] ?? agent.profile.name,
            publicKey: truncateKey(agent.publicKey),
            profile: {
                agentId: agent.agentId as AgentId,
                name: agent.profile.name,
                riskProfile: agent.profile.riskProfile,
                spreadThresholdPct: agent.profile.spreadThresholdPct,
                minConfidence: agent.profile.minConfidence,
                maxTxAmountSol: agent.profile.maxTxAmountSol,
                dailyVolumeCapSol: agent.profile.dailyVolumeCapSol,
                stopLossTriggerPct: agent.profile.stopLossTriggerPct,
            },
            operationalStatus: agent.operationalStatus,
            solBalance,
            usdcBalance,
            equity,
            netPnLUsd,
            pnlPercent,
            cycleCount: agent.cycleCount,
            pipeline: DEFAULT_PIPELINE.map((step) => ({ ...step })),
        };
    });
}

export function useAgents() {
    const { data, error, isLoading, mutate } = useSWR<Agent[]>(
        "agents",
        fetchAgentsWithBalances,
        {
            refreshInterval: 10_000,
            revalidateOnFocus: false,
            dedupingInterval: 5_000,
        }
    );

    return {
        agents: data ?? [],
        isLoading,
        error,
        mutate,
    };
}
