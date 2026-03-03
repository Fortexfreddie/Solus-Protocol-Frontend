"use client";

import { Badge, Divider, PingDot } from "@/components/ui/primitives";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/DropdownMenu";
import { Github, Wallet, Hexagon, Menu, Copy, ExternalLink, Zap, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_LINKS = [
    { label: "Monitor", href: "#monitor" },
    { label: "Config", href: "#config" },
    { label: "Logs", href: "#logs" },
];

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="w-8 h-8 rounded-lg bg-panel border border-edge" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-edge bg-panel hover:bg-panel-hover transition-all"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
            {isDark ? (
                <Sun className="w-4 h-4 text-[#FFB547]" />
            ) : (
                <Moon className="w-4 h-4 text-[#7C5CFC]" />
            )}
        </button>
    );
}

export interface HeaderStats {
    totalCycles: number;
    totalSwaps: number;
    totalProofs: number;
    walletAddress?: string;
}

interface HeaderProps {
    stats?: HeaderStats;
}

export function Header({ stats }: HeaderProps) {
    const cycles = stats?.totalCycles ?? 0;
    const swaps = stats?.totalSwaps ?? 0;
    const proofs = stats?.totalProofs ?? 0;
    const wallet = stats?.walletAddress;
    const walletShort = wallet
        ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
        : null;

    return (
        <header className="sticky top-0 z-50 glass border-b border-edge">
            {/* Animated gradient line at top */}
            <div className="h-[2px] w-full bg-gradient-to-r from-[#FF6B35] via-[#7C5CFC] to-[#00D68F] opacity-60" />

            <div className="h-14 px-4 md:px-6 flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Hexagon
                                className="w-5 h-5 text-[#00D68F] fill-[#00D68F]/15 shrink-0"
                                strokeWidth={1.5}
                            />
                            <div className="absolute inset-0 w-5 h-5 bg-[#00D68F]/20 blur-lg rounded-full" />
                        </div>
                        <span className="font-bold tracking-tight text-ink text-sm hidden xs:block">
                            SOLUS
                            <span className="text-[#00D68F]">.</span>
                            PROTOCOL
                        </span>
                    </div>

                    <Divider gradient className="hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#00D68F]/8 border border-[#00D68F]/20">
                            <PingDot color="sage" />
                            <span className="text-[10px] font-mono font-medium text-[#00D68F] uppercase tracking-wider">
                                Live
                            </span>
                        </div>
                        <Badge variant="amber" glow>Devnet</Badge>
                    </div>
                </div>

                {/* Center — session stats (desktop only) */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-dim">
                        <Zap className="w-3 h-3 text-[#FFB547]" />
                        <span className="text-ink-muted font-bold">{cycles}</span> cycles
                    </div>
                    <div className="w-px h-3 bg-edge" />
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-dim">
                        <span className="text-ink-muted font-bold">{swaps}</span> swaps
                    </div>
                    <div className="w-px h-3 bg-edge" />
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-dim">
                        <span className="text-ink-muted font-bold">{proofs}</span> proofs
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2.5">
                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-5">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1.5 text-xs font-mono text-ink-dim hover:text-ink transition-colors"
                            >
                                <span className="w-1 h-1 rounded-full bg-ink-faint" />
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <Divider gradient className="hidden md:block" />

                    {/* Theme toggle */}
                    <ThemeToggle />

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:block text-ink-dim hover:text-ink transition-colors"
                    >
                        <Github className="w-4 h-4" />
                    </a>

                    {/* Wallet dropdown — only show if we have a wallet address */}
                    {walletShort && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all group",
                                    "bg-panel border border-edge",
                                    "hover:bg-panel-hover hover:border-[#7C5CFC]/20"
                                )}>
                                    <Wallet className="w-3.5 h-3.5 text-ink-dim group-hover:text-[#7C5CFC] transition-colors" />
                                    <span className="text-xs font-mono text-ink-muted hidden sm:block">
                                        {walletShort}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => wallet && navigator.clipboard.writeText(wallet)}>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy Address
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={`https://explorer.solana.com/address/${wallet}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View on Explorer
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem destructive>
                                    Disconnect
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="md:hidden text-ink-muted hover:text-ink transition-colors"
                                aria-label="Toggle menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="md:hidden">
                            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                            {NAV_LINKS.map((link) => (
                                <DropdownMenuItem key={link.href} asChild>
                                    <a href={link.href}>{link.label}</a>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <div className="px-2.5 py-2 flex items-center gap-2">
                                <PingDot color="sage" />
                                <span className="text-[10px] font-mono text-[#00D68F]">LIVE</span>
                                <Badge variant="amber">Devnet</Badge>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
