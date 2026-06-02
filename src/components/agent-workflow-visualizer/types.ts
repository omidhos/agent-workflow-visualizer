export type AgentStatus =
  | "idle"
  | "thinking"
  | "searching"
  | "querying"
  | "analyzing"
  | "validating"
  | "completed"
  | "failed";

export type AgentStepStatus = "pending" | "active" | "completed" | "failed";

export type AgentStep = {
  id: string;
  label: string;
  status: AgentStepStatus;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  progress: number;
  currentTarget?: string;
  steps: AgentStep[];
  activity?: string;
  color?: string;
};

export type ActivityMessage = {
  id: string;
  agentId?: string;
  message: string;
  tone?: "info" | "success" | "warning" | "error";
  timestamp?: string;
};

export type AgentWorkflowPalette = {
  accent: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  surface: string;
  surfaceMuted: string;
};

export type AnimationIntensity = "calm" | "balanced" | "vivid";

export type AgentWorkflowMode = "compact" | "full";

export type AgentWorkflowState = "running" | "success" | "failure" | "fallback";

export type AgentWorkflowVisualizerProps = {
  agents: Agent[];
  currentStep?: string;
  completedSteps?: string[];
  progress?: number;
  activeTarget?: string;
  activity?: Array<ActivityMessage | string>;
  palette?: Partial<AgentWorkflowPalette>;
  intensity?: AnimationIntensity;
  mode?: AgentWorkflowMode;
  state?: AgentWorkflowState;
  title?: string;
  subtitle?: string;
  className?: string;
  showLogs?: boolean;
  showStepDetails?: boolean;
  emptyLabel?: string;
};
