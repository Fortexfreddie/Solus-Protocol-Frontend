"use client";

import { Agent, AgentId, RiskProfile, PipelineStep, PipelineStepStatus } from "@/types";
import { cn, formatEquity } from "@/lib/utils";
import { Switch } from "@/components/ui/Switch";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/Tooltip";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog";
import {
    CheckCircle2,
    XCircle,
    Circle,
    Loader2,
    Play,
    RefreshCw,
    PauseCircle,
    Eye,
    Shield,
    Zap,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

// ─── Agent color tokens ───────────────────────────────────────────────────────

const RISK_LABEL: Record<RiskProfile, string> = {
    aggressive: "Aggressive",
    conservative: "Conservative",
    balanced: "Balanced",
};

const RISK_BADGE: Record<RiskProfile, string> = {
    aggressive: "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/25",
    conservative: "bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/25",
    balanced: "bg-[#00D68F]/10 text-[#00D68F] border-[#00D68F]/25",
};

const AGENT_AVATAR: Record<AgentId, string> = {
    rex: "from-[#FF6B35]/25 to-[#FF6B35]/5 text-[#FF6B35] border-[#FF6B35]/20",
    nova: "from-[#7C5CFC]/25 to-[#7C5CFC]/5 text-[#7C5CFC] border-[#7C5CFC]/20",
    sage: "from-[#00D68F]/25 to-[#00D68F]/5 text-[#00D68F] border-[#00D68F]/20",
};

const AGENT_ACCENT_LINE: Record<AgentId, string> = {
    rex: "from-[#FF6B35]/80 via-[#FF6B35]/20 to-transparent",
    nova: "from-[#7C5CFC]/80 via-[#7C5CFC]/20 to-transparent",
    sage: "from-[#00D68F]/80 via-[#00D68F]/20 to-transparent",
};

const AGENT_GLOW: Record<AgentId, string> = {
    rex: "hover:shadow-[0_0_30px_rgba(255,107,53,0.08)]",
    nova: "hover:shadow-[0_0_30px_rgba(124,92,252,0.08)]",
    sage: "hover:shadow-[0_0_30px_rgba(0,214,143,0.08)]",
};

const SWITCH_COLOR: Record<RiskProfile, "amber" | "blue" | "emerald"> = {
    aggressive: "amber",
    conservative: "blue",
    balanced: "emerald",
};

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: PipelineStepStatus }) {
    if (status === "done")
        return <CheckCircle2 className="w-[15px] h-[15px] text-[#00D68F] shrink-0" />;
    if (status === "running")
        return <Loader2 className="w-[15px] h-[15px] text-[#FFB547] shrink-0 animate-spin" />;
    if (status === "error")
        return <XCircle className="w-[15px] h-[15px] text-[#FF5A5A] shrink-0" />;
    return <Circle className="w-[15px] h-[15px] text-slate-700 shrink-0" />;
}

function StepLabel({ step }: { step: PipelineStep }) {
    if (step.status === "running") {
        return (
            <span className="text-[11px] font-mono font-semibold text-[#FFB547] flex items-center gap-1">
                {step.label}
                <span className="flex gap-0.5">
                    {[0, 120, 240].map((d) => (
                        <span
                            key={d}
                            className="w-1 h-1 rounded-full bg-[#FFB547] animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                        />
                    ))}
                </span>
            </span>
        );
    }
    if (step.status === "error") {
        return (
            <span className="text-[11px] font-mono font-semibold text-[#FF5A5A]">
                {step.label}
                <span className="text-[#FF5A5A]/70 font-normal"> — Error</span>
            </span>
        );
    }
    return (
        <span
            className={cn(
                "text-[11px] font-mono",
                step.status === "done" ? "text-slate-400" : "text-slate-600"
            )}
        >
            {step.label}
        </span>
    );
}

// ─── Agent detail modal content ───────────────────────────────────────────────

function AgentDetailModal({ agent }: { agent: Agent }) {
    const { profile } = agent;
    const isPnLPos = agent.netPnLUsd >= 0;

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <div
                        className={cn(
                            "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            "font-bold text-xs font-mono border shrink-0",
                            AGENT_AVATAR[agent.id]
                        )}
                    >
                        {agent.name.split(" ")[1]?.[0] ?? "A"}
                    </div>
                    {agent.name}
                </DialogTitle>
                <DialogDescription>
                    Agent configuration and personality profile
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
                        <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">Equity</div>
                        <div className="text-sm font-mono font-bold text-ink">{formatEquity(agent.equity)}</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
                        <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">PnL</div>
                        <div className={cn("text-sm font-mono font-bold", isPnLPos ? "text-[#00D68F]" : "text-[#FF5A5A]")}>
                            {isPnLPos ? "+" : ""}{agent.netPnLUsd.toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
                        <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">Cycles</div>
                        <div className="text-sm font-mono font-bold text-ink">{agent.cycleCount}</div>
                    </div>
                </div>

                {/* Profile params */}
                <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Shield className="w-3 h-3" /> Policy Parameters
                        </span>
                    </div>
                    <div className="p-3 space-y-2">
                        {[
                            { label: "Spread Threshold", value: `≥ ${profile.spreadThresholdPct}%` },
                            { label: "Min Confidence", value: profile.minConfidence.toFixed(2) },
                            { label: "Max Tx Amount", value: `${profile.maxTxAmountSol} SOL` },
                            { label: "Daily Volume Cap", value: `${profile.dailyVolumeCapSol} SOL` },
                            { label: "Stop-Loss Trigger", value: `${profile.stopLossTriggerPct}%` },
                        ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500">{row.label}</span>
                                <span className="text-[11px] font-mono font-bold text-slate-300">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wallet info */}
                <div className="flex items-center justify-between bg-white/[0.02] rounded-xl px-3 py-2.5 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-500">Public Key</span>
                    <span className="text-[11px] font-mono text-slate-300">{agent.publicKey}</span>
                </div>
            </div>
        </>
    );
}

// ─── AgentCard ────────────────────────────────────────────────────────────────

interface AgentCardProps {
    agent: Agent;
    onToggle?: (id: AgentId, active: boolean) => void;
    onForceRun?: (id: AgentId) => void;
}

export function AgentCard({ agent, onToggle, onForceRun }: AgentCardProps) {
    const isActive = agent.operationalStatus === "ACTIVE";
    const hasError = agent.pipeline.some((s) => s.status === "error");
    const { riskProfile } = agent.profile;
    const isPnLPos = agent.netPnLUsd >= 0;

    const doneCount = agent.pipeline.filter((s) => s.status === "done").length;
    const progressPct = Math.round((doneCount / agent.pipeline.length) * 100);

    return (
        <div
            className={cn(
                "glass rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300",
                hasError
                    ? "border-[#FF5A5A]/25 shadow-[0_0_20px_rgba(255,90,90,0.07)]"
                    : "hover:border-white/10",
                AGENT_GLOW[agent.id]
            )}
        >
            {/* Accent line */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
                    AGENT_ACCENT_LINE[agent.id]
                )}
            />

            {/* Header */}
            <div className="px-4 pt-5 pb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                        <div
                            className={cn(
                                "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center",
                                "font-bold text-sm font-mono border shrink-0",
                                AGENT_AVATAR[agent.id]
                            )}
                        >
                            {agent.name.split(" ")[1]?.[0] ?? "A"}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-ink leading-tight truncate">
                            {agent.name}
                        </h3>
                        <p className="text-[10px] font-mono text-slate-600 mt-0.5 truncate">
                            {agent.publicKey}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border tracking-wide cursor-default",
                                    RISK_BADGE[riskProfile]
                                )}
                            >
                                {RISK_LABEL[riskProfile]}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <div className="space-y-1">
                                <div>Spread: ≥{agent.profile.spreadThresholdPct}%</div>
                                <div>Confidence: ≥{agent.profile.minConfidence}</div>
                                <div>Max Tx: {agent.profile.maxTxAmountSol} SOL</div>
                            </div>
                        </TooltipContent>
                    </Tooltip>

                    {/* Radix Switch kill-switch */}
                    <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => onToggle?.(agent.id, checked)}
                        accentColor={SWITCH_COLOR[riskProfile]}
                    />
                </div>
            </div>

            {/* Equity block */}
            <div className="mx-3 rounded-xl bg-inset px-3 py-2.5 mb-3 border border-edge">
                <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                        Portfolio Value
                    </span>
                    <span className="text-base font-mono font-bold text-ink tracking-tight">
                        {formatEquity(agent.equity)}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-600 uppercase tracking-wider">24h PnL</span>
                        <span
                            className={cn(
                                "text-[11px] font-mono font-bold flex items-center gap-0.5",
                                isPnLPos ? "text-[#00D68F]" : "text-[#FF5A5A]"
                            )}
                        >
                            {isPnLPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isPnLPos ? "+" : ""}
                            {agent.netPnLUsd.toFixed(2)} USD
                        </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600">
                        #{agent.cycleCount} cycles
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-track rounded-full h-[3px] overflow-hidden">
                    <div
                        className={cn(
                            "h-[3px] rounded-full transition-all duration-1000",
                            hasError
                                ? "bg-[#FF5A5A]"
                                : progressPct === 100
                                    ? "bg-[#00D68F]"
                                    : "bg-[#FFB547]"
                        )}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Pipeline */}
            <div className="px-4 pb-3 space-y-2 relative">
                <div className="absolute left-[23px] top-0 bottom-0 w-px bg-track" />
                {agent.pipeline.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-center gap-3 relative",
                            step.status === "pending" && "opacity-35"
                        )}
                    >
                        <div className="relative z-10 bg-background rounded-full">
                            <StepIcon status={step.status} />
                        </div>
                        <StepLabel step={step} />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto px-3 pb-3 flex gap-2">
                {hasError ? (
                    <button
                        onClick={() => onForceRun?.(agent.id)}
                        className={cn("flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl", "bg-[#FF5A5A]/10 hover:bg-[#FF5A5A]/20 text-xs font-bold text-[#FF5A5A]", "transition-all border border-[#FF5A5A]/20 hover:border-[#FF5A5A]/40")}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Cycle
                    </button>
                ) : !isActive ? (
                    <button
                        className={cn("flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl", "bg-slate-700/30 text-xs font-bold text-slate-500 border border-slate-700/30 cursor-not-allowed")}
                        disabled
                    >
                        <PauseCircle className="w-3.5 h-3.5" />
                        Paused
                    </button>
                ) : (
                    <button
                        onClick={() => onForceRun?.(agent.id)}
                        className={cn("flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl", "bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300", "transition-all border border-white/[0.06] hover:border-white/10")}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Force Run
                    </button>
                )}

                {/* Detail modal trigger */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className={cn("py-2 px-3 flex items-center justify-center rounded-xl", "bg-panel hover:bg-panel-hover text-ink-muted hover:text-ink", "transition-all border border-edge hover:border-edge-strong")}>
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <AgentDetailModal agent={agent} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
