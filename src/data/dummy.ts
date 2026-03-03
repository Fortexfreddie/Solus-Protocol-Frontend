import {
    Agent,
    AuditEntry,
    LeaderboardEntry,
    PolicyCheck,
    ProofRecord,
    StrategistLine,
    SystemStats,
    TokenPrice,
} from "@/types";

// ─── Agent Personalities (matches swagger PersonalityProfile exactly) ──────────

const REX_PROFILE = {
    agentId: "rex" as const,
    name: "Rex",
    riskProfile: "aggressive" as const,
    spreadThresholdPct: 0.5,
    minConfidence: 0.65,
    maxTxAmountSol: 0.2,
    dailyVolumeCapSol: 1.0,
    stopLossTriggerPct: -20,
};

const NOVA_PROFILE = {
    agentId: "nova" as const,
    name: "Nova",
    riskProfile: "conservative" as const,
    spreadThresholdPct: 1.0,
    minConfidence: 0.85,
    maxTxAmountSol: 0.05,
    dailyVolumeCapSol: 0.3,
    stopLossTriggerPct: -10,
};

const SAGE_PROFILE = {
    agentId: "sage" as const,
    name: "Sage",
    riskProfile: "balanced" as const,
    spreadThresholdPct: 0.75,
    minConfidence: 0.75,
    maxTxAmountSol: 0.1,
    dailyVolumeCapSol: 0.5,
    stopLossTriggerPct: -15,
};

// ─── Agents ───────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
    {
        id: "rex",
        name: "Agent Rex",
        publicKey: "4aRX...9f22", // Solana Base58
        profile: REX_PROFILE,
        operationalStatus: "ACTIVE",
        solBalance: 1.84,
        usdcBalance: 2000.0,
        equity: 4291.5,
        netPnLUsd: 91.5,      // vs baseline (initial 2 SOL airdrop valued at live SOL price)
        pnlPercent: 2.18,
        cycleCount: 142,
        pipeline: [
            { id: "oracle", label: "Price Oracle", status: "done" },
            { id: "signal", label: "Signal Analysis (L1b)", status: "done" },
            { id: "strategy", label: "Strategist (DeepSeek)", status: "running" },
            { id: "guardian", label: "Guardian (Gemini)", status: "pending" },
            { id: "policy", label: "Policy Engine (9 checks)", status: "pending" },
            { id: "proof", label: "Proof-of-Reasoning", status: "pending" },
            { id: "vault", label: "Vault Sign (AES-256)", status: "pending" },
            // L7 omitted from card — shows in audit feed as TX_CONFIRMED
        ],
    },
    {
        id: "nova",
        name: "Agent Nova",
        publicKey: "8bNV...1a04",
        profile: NOVA_PROFILE,
        operationalStatus: "ACTIVE",
        solBalance: 2.01,
        usdcBalance: 1480.0,
        equity: 1850.2,
        netPnLUsd: -49.8,
        pnlPercent: -2.62,
        cycleCount: 89,
        pipeline: [
            { id: "oracle", label: "Price Oracle", status: "pending" },
            { id: "signal", label: "Signal Analysis (L1b)", status: "pending" },
            { id: "strategy", label: "Strategist (DeepSeek)", status: "pending" },
            { id: "guardian", label: "Guardian (Gemini)", status: "pending" },
            { id: "policy", label: "Policy Engine (9 checks)", status: "pending" },
            { id: "proof", label: "Proof-of-Reasoning", status: "pending" },
            { id: "vault", label: "Vault Sign (AES-256)", status: "pending" },
        ],
    },
    {
        id: "sage",
        name: "Agent Sage",
        publicKey: "2cSG...881a",
        profile: SAGE_PROFILE,
        operationalStatus: "ACTIVE",
        solBalance: 2.12,
        usdcBalance: 2710.0,
        equity: 3102.44,
        netPnLUsd: 202.44,
        pnlPercent: 6.98,
        cycleCount: 118,
        pipeline: [
            { id: "oracle", label: "Price Oracle", status: "done" },
            { id: "signal", label: "Signal Analysis (L1b)", status: "done" },
            { id: "strategy", label: "Strategist (DeepSeek)", status: "error" },
            { id: "guardian", label: "Guardian (Gemini)", status: "pending" },
            { id: "policy", label: "Policy Engine (9 checks)", status: "pending" },
            { id: "proof", label: "Proof-of-Reasoning", status: "pending" },
            { id: "vault", label: "Vault Sign (AES-256)", status: "pending" },
        ],
    },
];

// ─── Leaderboard (matches /api/leaderboard schema — PnL in USD) ───────────────

export const LEADERBOARD: LeaderboardEntry[] = [
    {
        rank: 1,
        agentId: "sage",
        name: "Agent Sage",
        netPnLUsd: 202.44,
        liveValueUsd: 3102.44,
        baselineUsd: 2900.0,
        solBalance: 2.12,
        usdcBalance: 2710.0,
        swapCount: 48,
    },
    {
        rank: 2,
        agentId: "rex",
        name: "Agent Rex",
        netPnLUsd: 91.5,
        liveValueUsd: 4291.5,
        baselineUsd: 4200.0,
        solBalance: 1.84,
        usdcBalance: 2000.0,
        swapCount: 67,
    },
    {
        rank: 3,
        agentId: "nova",
        name: "Agent Nova",
        netPnLUsd: -49.8,
        liveValueUsd: 1850.2,
        baselineUsd: 1900.0,
        solBalance: 2.01,
        usdcBalance: 1480.0,
        swapCount: 22,
    },
];

// ─── Prices (matches /api/prices and PriceData.prices shape) ─────────────────

export const PRICES: TokenPrice[] = [
    { symbol: "SOL", price: 185.23, change24h: 2.1, direction: "up" },
    { symbol: "USDC", price: 1.0002, change24h: 0.01, direction: "up" },
    { symbol: "RAY", price: 2.48, change24h: -1.3, direction: "down" },
    { symbol: "BONK", price: 0.0000189, change24h: 5.4, direction: "up" },
];

// ─── Audit Log (matches winston append-only audit format) ─────────────────────

export const AUDIT_LOG: AuditEntry[] = [
    {
        id: "a1",
        timestamp: "14:24:05",
        agentId: "nova",
        agentLabel: "NOVA",
        severity: "info",
        message: "Executing swap 14.2 SOL → USDC via Jupiter (Kora co-sign pending)",
        txLink: "#",
    },
    {
        id: "a2",
        timestamp: "14:23:58",
        agentId: "rex",
        agentLabel: "REX",
        severity: "error",
        message: "POLICY_FAIL [check_5]: Daily volume cap exceeded (used: 0.98 SOL / limit: 1.0 SOL)",
        txLink: "#",
    },
    {
        id: "a3",
        timestamp: "14:23:42",
        agentId: "rex",
        agentLabel: "REX",
        severity: "info",
        message: "Guardian APPROVE: Signal strength 0.88. Strategist confidence 0.79 ≥ 0.65 threshold.",
        txLink: "#",
    },
    {
        id: "a4",
        timestamp: "14:23:10",
        agentId: "sys",
        agentLabel: "SYS",
        severity: "system",
        message: "Heartbeat sync complete. RPC latency 14ms. Kora: online.",
    },
    {
        id: "a5",
        timestamp: "14:22:55",
        agentId: "nova",
        agentLabel: "NOVA",
        severity: "info",
        message: "L2 HOLD decision (confidence: 0.71 < 0.85 threshold). Skipping cycle.",
        txLink: "#",
    },
    {
        id: "a6",
        timestamp: "14:22:12",
        agentId: "rex",
        agentLabel: "REX",
        severity: "success",
        message: "TX_CONFIRMED: Proof #4922 anchored on-chain. Swap +0.42% PnL. Sig: 3vFq...8wUt",
        txLink: "#",
    },
    {
        id: "a7",
        timestamp: "14:21:44",
        agentId: "sage",
        agentLabel: "SAGE",
        severity: "warning",
        message: "Guardian MODIFY: Amount reduced 0.1→0.06 SOL. Volatility penalty 40%.",
        txLink: "#",
    },
    {
        id: "a8",
        timestamp: "14:21:02",
        agentId: "sage",
        agentLabel: "SAGE",
        severity: "success",
        message: "PROOF_ANCHORED: SHA-256 hash submitted to Devnet Memo. Block #299103.",
        txLink: "#",
    },
];

// ─── Proofs (matches /api/proofs response) ────────────────────────────────────

export const PROOFS: ProofRecord[] = [
    {
        id: "p1",
        blockNumber: "#299104",
        hash: "0x77a4...9b2a",
        memoSignature: "3vFq...8wUt",
        confidence: 0.98,
        status: "verified",
        agentId: "rex",
        timestamp: "14:24:01",
        cycle: 142,
    },
    {
        id: "p2",
        blockNumber: "#299103",
        hash: "0x3c88...11f0",
        memoSignature: "9xKp...2mNz",
        confidence: 0.78,
        status: "verified",
        agentId: "sage",
        timestamp: "14:21:02",
        cycle: 118,
    },
    {
        id: "p3",
        blockNumber: "Mempool",
        hash: "0xa1f3...88c2",
        memoSignature: undefined,
        confidence: null,
        status: "pending",
        agentId: "nova",
        timestamp: "14:24:05",
        cycle: 89,
    },
];

// ─── Strategist Reasoning (DeepSeek output + L3 Guardian) ────────────────────

export const STRATEGIST_LINES: StrategistLine[] = [
    { type: "comment", text: "# [L1] Price Oracle — SOL $185.23 (+2.1%)" },
    { type: "comment", text: "# [L1b] Jupiter quote: SOL→USDC, spread 0.23%" },
    { type: "pass", text: "> RSI_14 (34) < 40 : TRUE" },
    { type: "pass", text: "> VOL_24H > 1.2M : TRUE" },
    { type: "comment", text: "# [L2] DeepSeek reasoning..." },
    { type: "warn", text: "> BTC_CORR (0.89) > 0.85 : WARNING" },
    { type: "pass", text: "> CONFIDENCE (0.79) >= 0.65 : OK" },
    { type: "result", text: ">> DECISION: SWAP 0.15 SOL→USDC @ 184.50" },
];

// ─── Policy Checks (matches backend 9-check engine output) ───────────────────

export const POLICY_CHECKS: PolicyCheck[] = [
    { id: 1, name: "action_whitelist", label: "Action Whitelist", status: "pass" },
    { id: 2, name: "token_whitelist", label: "Token Whitelist (SOL/USDC)", status: "pass" },
    { id: 3, name: "min_confidence", label: "Min Confidence ≥ 0.65", status: "pass" },
    {
        id: 4,
        name: "volatility_sizing",
        label: "Volatility-Adjusted Sizing",
        detail: "safeAmt = 0.2 × 0.79 × (1 - 0.0) = 0.158 SOL",
        status: "pass",
    },
    { id: 5, name: "daily_volume_cap", label: "Daily Vol Cap (< 1.0 SOL)", status: "pass" },
    { id: 6, name: "rate_limit", label: "Rate Limit (5 tx/min)", status: "pass" },
    { id: 7, name: "balance_check", label: "Balance + Fee Available", status: "pass" },
    {
        id: 8,
        name: "spread_threshold",
        label: "Spread ≥ 0.5% Net (Jupiter)",
        detail: "netSpreadVsMarket: 0.00207 > 0.005 threshold",
        status: "pass",
    },
    { id: 9, name: "stop_loss_circuit", label: "Stop-Loss Circuit (-20%)", status: "pass" },
];

// ─── System Stats (matches /health response) ──────────────────────────────────

export const SYSTEM_STATS: SystemStats = {
    load: 24,
    latencyMs: 14,
    verifiersOnline: 12,
    verifiersTotal: 15,
    network: "Devnet",
    rpcConnected: true,
    koraConnected: true,
    pricesFresh: true,
};
