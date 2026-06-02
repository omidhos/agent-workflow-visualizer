# Agent Workflow Visualizer

A GitHub-ready React/Next.js component for replacing plain "AI is thinking..." states with a premium animated view of multiple AI agents working through DB-QA workflows.

It is built with TypeScript, Tailwind CSS, Framer Motion, and lucide-react. The component is reusable, responsive, accessible, and supports light and dark mode.

## Features

- Multi-agent workflow visualization
- Diamond-inspired animated agent cores
- Flowing connector beam between active agents
- Steps for searching, querying, analyzing, validating, and completing
- Activity log stream
- Configurable palettes, intensity, compact/full modes, progress, success/failure/fallback states
- Fully typed props and exported sample data

## Install

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

Copy `src/components/agent-workflow-visualizer` and `src/lib/utils.ts` into your app, or import directly from this project.

Package entrypoints are also provided:

```tsx
import { AgentWorkflowVisualizer } from "agent-workflow-visualizer";
```

## Usage

```tsx
import {
  AgentWorkflowVisualizer,
  sampleAgents,
  sampleActivity,
} from "@/components/agent-workflow-visualizer";

export default function LoadingState() {
  return (
    <AgentWorkflowVisualizer
      agents={sampleAgents}
      currentStep="Validating result confidence"
      completedSteps={["schema-scan", "query-draft", "query-run"]}
      progress={74}
      activeTarget="warehouse.customer_orders"
      activity={sampleActivity}
      intensity="vivid"
      mode="full"
      state="running"
    />
  );
}
```

## Props

- `agents`: typed agent list with name, role, status, progress, target, steps, activity, and color
- `currentStep`, `completedSteps`, `progress`, `activeTarget`: orchestration metadata
- `activity`: terminal-style log messages as strings or structured events
- `palette`: override accent, secondary, success, warning, danger, and surface colors
- `intensity`: `"calm" | "balanced" | "vivid"`
- `mode`: `"full" | "compact"`
- `state`: `"running" | "success" | "failure" | "fallback"`
- `showLogs`, `showStepDetails`, `title`, `subtitle`, `className`: display controls

## Main Types

```ts
type AgentStatus =
  | "idle"
  | "thinking"
  | "searching"
  | "querying"
  | "analyzing"
  | "validating"
  | "completed"
  | "failed";

type AgentStep = {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "failed";
};

type Agent = {
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
```

## Run The Demo

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
