import {
  AgentWorkflowVisualizer,
  sampleActivity,
  sampleAgents,
} from "@/components/agent-workflow-visualizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.14),transparent_30%),var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Reusable React Component
            </p>
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Long-running AI workflows, visualized like a premium control room.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Drop this into a Next.js app to replace dull loading copy with a typed, configurable,
            animated workflow for DB-QA agents.
          </p>
        </header>

        <AgentWorkflowVisualizer
          activeTarget="warehouse.customer_orders"
          activity={sampleActivity}
          agents={sampleAgents}
          completedSteps={["schema-scan", "query-draft", "query-plan"]}
          currentStep="Validating regional answer confidence"
          intensity="vivid"
          progress={74}
          state="running"
          title="DB-QA Agent Swarm"
        />

        <section className="grid gap-4 lg:grid-cols-2">
          <AgentWorkflowVisualizer
            activeTarget="analytics.revenue_by_segment"
            activity={[
              "Fallback sampler selected the safest cached aggregate.",
              "Validator requested a narrower confidence interval.",
            ]}
            agents={sampleAgents.slice(0, 3).map((agent, index) => ({
              ...agent,
              status: index === 0 ? "completed" : index === 1 ? "validating" : "thinking",
              progress: index === 0 ? 100 : 52,
            }))}
            completedSteps={["cached-plan"]}
            currentStep="Checking cached answer path"
            intensity="calm"
            mode="compact"
            progress={58}
            state="fallback"
            subtitle="Compact mode keeps the signal high in chat sidebars, drawers, and message rows."
            title="Compact Fallback"
          />

          <AgentWorkflowVisualizer
            activeTarget="warehouse.answer_evidence"
            activity={sampleActivity.slice(0, 2)}
            agents={sampleAgents.map((agent) => ({
              ...agent,
              status: "completed",
              progress: 100,
              steps: agent.steps.map((step) => ({ ...step, status: "completed" })),
            }))}
            completedSteps={["schema-scan", "query-run", "comparison", "validation"]}
            currentStep="Final response produced"
            intensity="balanced"
            mode="compact"
            progress={100}
            state="success"
            subtitle="Success and failure states are first-class, so the loader can resolve gracefully."
            title="Completed Response"
          />
        </section>
      </div>
    </main>
  );
}
