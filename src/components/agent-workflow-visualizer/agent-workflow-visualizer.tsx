"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  CircleDashed,
  Database,
  GitCompareArrows,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Table2,
  TerminalSquare,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type {
  ActivityMessage,
  Agent,
  AgentStatus,
  AgentStep,
  AgentStepStatus,
  AgentWorkflowPalette,
  AgentWorkflowState,
  AgentWorkflowVisualizerProps,
  AnimationIntensity,
} from "./types";

const defaultPalette: AgentWorkflowPalette = {
  accent: "#38bdf8",
  secondary: "#a78bfa",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  surface: "rgba(15, 23, 42, 0.72)",
  surfaceMuted: "rgba(148, 163, 184, 0.12)",
};

const intensityConfig: Record<
  AnimationIntensity,
  { duration: number; glow: number; particleCount: number; travelDuration: number }
> = {
  calm: { duration: 7, glow: 0.35, particleCount: 3, travelDuration: 5.6 },
  balanced: { duration: 4.7, glow: 0.58, particleCount: 5, travelDuration: 3.8 },
  vivid: { duration: 2.9, glow: 0.86, particleCount: 8, travelDuration: 2.5 },
};

const statusCopy: Record<AgentStatus, string> = {
  idle: "Idle",
  thinking: "Thinking",
  searching: "Searching",
  querying: "Querying",
  analyzing: "Analyzing",
  validating: "Validating",
  completed: "Completed",
  failed: "Failed",
};

const statusTone: Record<AgentStatus, string> = {
  idle: "text-muted-foreground",
  thinking: "text-sky-500 dark:text-sky-300",
  searching: "text-cyan-500 dark:text-cyan-300",
  querying: "text-violet-500 dark:text-violet-300",
  analyzing: "text-teal-500 dark:text-teal-300",
  validating: "text-amber-500 dark:text-amber-300",
  completed: "text-emerald-500 dark:text-emerald-300",
  failed: "text-red-500 dark:text-red-300",
};

export function AgentWorkflowVisualizer({
  agents,
  currentStep = "Coordinating agent workflow",
  completedSteps = [],
  progress,
  activeTarget,
  activity = [],
  palette,
  intensity = "balanced",
  mode = "full",
  state = "running",
  title = "Agent Workflow",
  subtitle = "DB-QA agents are searching, querying, validating, and composing a reliable answer.",
  className,
  showLogs = true,
  showStepDetails = true,
  emptyLabel = "Waiting for agents to start",
}: AgentWorkflowVisualizerProps) {
  const prefersReducedMotion = useReducedMotion();
  const mergedPalette = React.useMemo(
    () => ({ ...defaultPalette, ...palette }),
    [palette],
  );
  const config = intensityConfig[intensity];
  const normalizedProgress =
    progress ?? Math.round(agents.reduce((sum, agent) => sum + agent.progress, 0) / Math.max(agents.length, 1));
  const activeAgents = agents.filter((agent) =>
    ["thinking", "searching", "querying", "analyzing", "validating"].includes(agent.status),
  );
  const completedAgentCount = agents.filter((agent) => agent.status === "completed").length;
  const isCompact = mode === "compact";

  if (!agents.length) {
    return (
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card p-6 text-card-foreground shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-muted">
            <CircleDashed className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{emptyLabel}</p>
            <p className="text-xs text-muted-foreground">Provide an agents array to visualize the workflow.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl shadow-slate-950/10",
        "dark:border-white/10 dark:bg-[#070a12] dark:shadow-sky-950/20",
        isCompact ? "p-4" : "p-4 sm:p-6 lg:p-7",
        className,
      )}
      style={
        {
          "--aw-accent": mergedPalette.accent,
          "--aw-secondary": mergedPalette.secondary,
          "--aw-success": mergedPalette.success,
          "--aw-warning": mergedPalette.warning,
          "--aw-danger": mergedPalette.danger,
          "--aw-surface": mergedPalette.surface,
          "--aw-surface-muted": mergedPalette.surfaceMuted,
          "--aw-glow": config.glow,
        } as React.CSSProperties
      }
    >
      <AmbientField reduced={Boolean(prefersReducedMotion)} duration={config.duration} />

      <div className="relative z-10">
        <WorkflowHeader
          activeTarget={activeTarget}
          completedAgentCount={completedAgentCount}
          currentStep={currentStep}
          progress={normalizedProgress}
          state={state}
          subtitle={subtitle}
          title={title}
          totalAgents={agents.length}
        />

        <div className={cn("mt-5", isCompact ? "space-y-4" : "space-y-6")}>
          <TransitSpine
            agents={agents}
            intensity={intensity}
            palette={mergedPalette}
            reduced={Boolean(prefersReducedMotion)}
            state={state}
          />

          <div
            className={cn(
              "grid gap-3",
              isCompact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
            )}
          >
            {agents.map((agent, index) => (
              <AgentCard
                agent={agent}
                index={index}
                isCompact={isCompact}
                key={agent.id}
                reduced={Boolean(prefersReducedMotion)}
                showStepDetails={showStepDetails && !isCompact}
              />
            ))}
          </div>

          {!isCompact && (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <StepConsole
                activeAgents={activeAgents}
                completedSteps={completedSteps}
                currentStep={currentStep}
                state={state}
              />
              {showLogs && <ActivityLog activity={activity} agents={agents} />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WorkflowHeader({
  activeTarget,
  completedAgentCount,
  currentStep,
  progress,
  state,
  subtitle,
  title,
  totalAgents,
}: {
  activeTarget?: string;
  completedAgentCount: number;
  currentStep: string;
  progress: number;
  state: AgentWorkflowState;
  subtitle: string;
  title: string;
  totalAgents: number;
}) {
  const stateMeta = getStateMeta(state);
  const StateIcon = stateMeta.icon;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--aw-surface-muted)] px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <StateIcon className={cn("size-3.5", stateMeta.className)} />
            {stateMeta.label}
          </span>
          {activeTarget && (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/10 bg-[var(--aw-surface-muted)] px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
              <Database className="size-3.5 text-[var(--aw-accent)]" />
              <span className="truncate">{activeTarget}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--aw-surface-muted)] px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
            <ShieldCheck className="size-3.5 text-[var(--aw-success)]" />
            {completedAgentCount}/{totalAgents} agents complete
          </span>
        </div>
        <h2 className="text-balance text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>

      <div className="w-full shrink-0 lg:w-72">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">{currentStep}</span>
          <span className="font-mono text-foreground">{clamp(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            animate={{ width: `${clamp(progress)}%` }}
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--aw-accent),var(--aw-secondary),var(--aw-success))]"
            initial={false}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function TransitSpine({
  agents,
  intensity,
  palette,
  reduced,
  state,
}: {
  agents: Agent[];
  intensity: AnimationIntensity;
  palette: AgentWorkflowPalette;
  reduced: boolean;
  state: AgentWorkflowState;
}) {
  const config = intensityConfig[intensity];
  const hasFailed = state === "failure" || agents.some((agent) => agent.status === "failed");
  const lineColor = hasFailed ? palette.danger : state === "success" ? palette.success : palette.accent;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-[var(--aw-surface-muted)] p-3 backdrop-blur-xl dark:border-white/10">
      <div className="absolute inset-y-0 left-6 right-6 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <motion.div
        animate={reduced ? undefined : { opacity: [0.35, 0.9, 0.35], scaleX: [0.98, 1, 0.98] }}
        className="absolute inset-y-0 left-6 right-6 top-1/2 h-px origin-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${lineColor}, ${palette.secondary}, transparent)`,
          boxShadow: `0 0 ${24 * config.glow}px ${lineColor}`,
        }}
        transition={{ duration: config.duration, repeat: Infinity, ease: "easeInOut" }}
      />
      {!reduced &&
        Array.from({ length: config.particleCount }).map((_, index) => (
          <motion.span
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            className="absolute top-1/2 size-1.5 rounded-full"
            key={index}
            style={{
              background: index % 2 ? palette.secondary : lineColor,
              boxShadow: `0 0 18px ${index % 2 ? palette.secondary : lineColor}`,
            }}
            transition={{
              delay: index * 0.35,
              duration: config.travelDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        ))}
      <div className="relative flex items-center justify-between gap-2">
        {agents.map((agent, index) => (
          <div className="flex min-w-0 flex-1 items-center justify-center" key={agent.id}>
            <div className="relative flex flex-col items-center gap-2">
              <AgentDiamond agent={agent} size="sm" reduced={reduced} />
              <span className="hidden max-w-24 truncate text-center text-[10px] font-medium text-muted-foreground sm:block">
                {agent.name}
              </span>
              {index < agents.length - 1 && <span className="sr-only">flows to next agent</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  index,
  isCompact,
  reduced,
  showStepDetails,
}: {
  agent: Agent;
  index: number;
  isCompact: boolean;
  reduced: boolean;
  showStepDetails: boolean;
}) {
  const StatusIcon = getStatusIcon(agent.status);
  const progress = clamp(agent.progress);

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border bg-background/80 p-4 shadow-sm backdrop-blur-xl transition-colors hover:border-[color-mix(in_oklab,var(--agent-color),transparent_45%)] dark:border-white/10 dark:bg-white/[0.035]"
      initial={{ opacity: 0, y: 14 }}
      style={{ "--agent-color": agent.color ?? "var(--aw-accent)" } as React.CSSProperties}
      transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--agent-color)] to-transparent opacity-50" />
      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-[var(--agent-color)] opacity-[calc(var(--aw-glow)*0.16)] blur-2xl" />

      <div className="relative flex items-start gap-3">
        <AgentDiamond agent={agent} reduced={reduced} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">{agent.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{agent.role}</p>
            </div>
            <span className={cn("inline-flex items-center gap-1 rounded-full text-xs font-medium", statusTone[agent.status])}>
              <StatusIcon className={cn("size-3.5", isSpinningStatus(agent.status) && "animate-spin")} />
              <span className="hidden sm:inline">{statusCopy[agent.status]}</span>
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{agent.currentTarget ?? "No active target"}</span>
              <span className="font-mono text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full bg-[var(--agent-color)]"
                initial={false}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {agent.activity && (
        <p className={cn("relative mt-3 text-xs leading-5 text-muted-foreground", isCompact && "line-clamp-1")}>
          {agent.activity}
        </p>
      )}

      {showStepDetails && (
        <div className="relative mt-4 space-y-2">
          {agent.steps.map((step) => (
            <StepRow key={step.id} step={step} />
          ))}
        </div>
      )}
    </motion.article>
  );
}

function AgentDiamond({
  agent,
  reduced,
  size = "md",
}: {
  agent: Agent;
  reduced: boolean;
  size?: "sm" | "md";
}) {
  const isActive = ["thinking", "searching", "querying", "analyzing", "validating"].includes(agent.status);
  const iconSize = size === "sm" ? "size-8" : "size-12";
  const innerSize = size === "sm" ? "size-4" : "size-6";

  return (
    <div
      className={cn("relative grid shrink-0 place-items-center", iconSize)}
      style={{ "--agent-color": agent.color ?? "var(--aw-accent)" } as React.CSSProperties}
    >
      {isActive && !reduced && (
        <motion.div
          animate={{ scale: [0.72, 1.45], opacity: [0.35, 0] }}
          className="absolute inset-0 rounded-full bg-[var(--agent-color)]"
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                rotate: isActive ? [45, 135, 225, 315, 405] : 45,
                scale: isActive ? [1, 1.05, 1] : 1,
              }
        }
        className="absolute inset-1 rounded-[0.38rem] border bg-background shadow-lg dark:bg-[#0b1020]"
        style={{
          borderColor: "color-mix(in oklab, var(--agent-color), transparent 35%)",
          boxShadow: `0 0 24px color-mix(in oklab, var(--agent-color), transparent 50%)`,
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />
      <div className={cn("relative rotate-45 rounded-[0.25rem] bg-[var(--agent-color)]", innerSize)}>
        <div className="absolute inset-1 rounded-[0.18rem] bg-white/80 dark:bg-black/55" />
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <Sparkles className="size-3.5 text-white drop-shadow dark:text-white" />
      </div>
    </div>
  );
}

function StepRow({ step }: { step: AgentStep }) {
  const icon = getStepIcon(step.status);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={cn("grid size-5 place-items-center rounded-full border", icon.className)}>
        <icon.Icon className="size-3" />
      </span>
      <span className={cn("min-w-0 flex-1 truncate", step.status === "pending" && "text-muted-foreground")}>
        {step.label}
      </span>
    </div>
  );
}

function StepConsole({
  activeAgents,
  completedSteps,
  currentStep,
  state,
}: {
  activeAgents: Agent[];
  completedSteps: string[];
  currentStep: string;
  state: AgentWorkflowState;
}) {
  const stateMeta = getStateMeta(state);
  const StateIcon = stateMeta.icon;

  return (
    <div className="rounded-xl border bg-background/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Execution Trace</p>
          <p className="text-xs text-muted-foreground">Current orchestration and completed milestones</p>
        </div>
        <StateIcon className={cn("size-5", stateMeta.className)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-[var(--aw-surface-muted)] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Zap className="size-3.5 text-[var(--aw-accent)]" />
            Active step
          </div>
          <p className="text-sm font-medium">{currentStep}</p>
        </div>
        <div className="rounded-lg bg-[var(--aw-surface-muted)] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Activity className="size-3.5 text-[var(--aw-secondary)]" />
            Active agents
          </div>
          <p className="truncate text-sm font-medium">
            {activeAgents.length ? activeAgents.map((agent) => agent.name).join(", ") : "No active agents"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {completedSteps.length ? (
          completedSteps.map((step) => (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--aw-success),transparent_86%)] px-2 py-1 text-xs text-emerald-600 dark:text-emerald-300"
              key={step}
            >
              <CheckCircle2 className="size-3" />
              {step}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">Milestones will appear as agents complete work.</span>
        )}
      </div>
    </div>
  );
}

function ActivityLog({ activity, agents }: { activity: Array<ActivityMessage | string>; agents: Agent[] }) {
  const normalized = activity.map<ActivityMessage>((item, index) =>
    typeof item === "string"
      ? { id: String(index), message: item, tone: "info" }
      : {
          tone: "info",
          ...item,
        },
  );

  return (
    <div className="rounded-xl border bg-slate-950 p-4 font-mono text-white shadow-lg shadow-slate-950/20 dark:border-white/10">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <TerminalSquare className="size-4 text-[var(--aw-accent)]" />
          Live Activity
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-400">{normalized.length} events</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {normalized.slice(-5).map((item) => {
            const agent = agents.find((candidate) => candidate.id === item.agentId);

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 rounded-lg bg-white/[0.04] p-2 text-xs leading-5 text-slate-300"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 8 }}
                key={item.id}
                layout
              >
                <span className={cn("mt-0.5 size-2 shrink-0 rounded-full", getActivityTone(item.tone))} />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <span>{item.timestamp ?? "now"}</span>
                    {agent && <span className="truncate">{agent.name}</span>}
                  </div>
                  <p>{item.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AmbientField({ duration, reduced }: { duration: number; reduced: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--aw-accent),transparent_78%),transparent_32%),radial-gradient(circle_at_80%_0%,color-mix(in_oklab,var(--aw-secondary),transparent_82%),transparent_28%),linear-gradient(135deg,transparent,rgba(255,255,255,0.04))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
      {!reduced && (
        <motion.div
          animate={{ x: ["-20%", "20%", "-20%"], opacity: [0.25, 0.45, 0.25] }}
          className="absolute left-1/2 top-0 h-full w-1/2 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--aw-accent),transparent_78%),transparent)] blur-2xl"
          transition={{ duration: duration * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function getStatusIcon(status: AgentStatus) {
  const icons: Record<AgentStatus, React.ComponentType<{ className?: string }>> = {
    idle: CircleDashed,
    thinking: BrainCircuit,
    searching: Search,
    querying: Database,
    analyzing: GitCompareArrows,
    validating: ShieldCheck,
    completed: CheckCircle2,
    failed: XCircle,
  };

  return icons[status];
}

function getStepIcon(status: AgentStepStatus) {
  switch (status) {
    case "completed":
      return {
        Icon: CheckCircle2,
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300",
      };
    case "active":
      return {
        Icon: Loader2,
        className: "border-sky-500/30 bg-sky-500/10 text-sky-500 dark:text-sky-300 [&_svg]:animate-spin",
      };
    case "failed":
      return {
        Icon: XCircle,
        className: "border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-300",
      };
    default:
      return {
        Icon: CircleDashed,
        className: "border-border bg-muted text-muted-foreground",
      };
  }
}

function getStateMeta(state: AgentWorkflowState) {
  switch (state) {
    case "success":
      return { icon: CheckCircle2, label: "Response ready", className: "text-emerald-500 dark:text-emerald-300" };
    case "failure":
      return { icon: AlertTriangle, label: "Workflow failed", className: "text-red-500 dark:text-red-300" };
    case "fallback":
      return { icon: Table2, label: "Fallback mode", className: "text-amber-500 dark:text-amber-300" };
    default:
      return { icon: Loader2, label: "Running workflow", className: "text-sky-500 dark:text-sky-300 animate-spin" };
  }
}

function getActivityTone(tone: ActivityMessage["tone"]) {
  switch (tone) {
    case "success":
      return "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.65)]";
    case "warning":
      return "bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.65)]";
    case "error":
      return "bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.65)]";
    default:
      return "bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.65)]";
  }
}

function isSpinningStatus(status: AgentStatus) {
  return status === "thinking" || status === "querying";
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
