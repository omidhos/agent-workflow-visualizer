import type { ActivityMessage, Agent } from "./types";

export const sampleAgents: Agent[] = [
  {
    id: "schema-scout",
    name: "Schema Scout",
    role: "Database search and schema discovery",
    status: "completed",
    progress: 100,
    currentTarget: "warehouse.customer_orders",
    color: "#38bdf8",
    activity: "Mapped 18 relevant columns across 4 joined tables.",
    steps: [
      { id: "connect", label: "Connect to warehouse", status: "completed" },
      { id: "scan", label: "Scan table metadata", status: "completed" },
      { id: "rank", label: "Rank candidate joins", status: "completed" },
    ],
  },
  {
    id: "query-runner",
    name: "Query Runner",
    role: "SQL planning and execution",
    status: "querying",
    progress: 68,
    currentTarget: "orders_by_region.sql",
    color: "#a78bfa",
    activity: "Running optimized aggregate query with guarded filters.",
    steps: [
      { id: "draft", label: "Draft SQL", status: "completed" },
      { id: "dry-run", label: "Dry-run query plan", status: "completed" },
      { id: "execute", label: "Execute query", status: "active" },
    ],
  },
  {
    id: "answer-analyst",
    name: "Answer Analyst",
    role: "Result interpretation and comparison",
    status: "analyzing",
    progress: 44,
    currentTarget: "result_set_024",
    color: "#2dd4bf",
    activity: "Comparing returned totals against historical baseline.",
    steps: [
      { id: "normalize", label: "Normalize rows", status: "completed" },
      { id: "compare", label: "Compare answer paths", status: "active" },
      { id: "explain", label: "Prepare explanation", status: "pending" },
    ],
  },
  {
    id: "validator",
    name: "Validator",
    role: "Confidence checks and final response",
    status: "validating",
    progress: 28,
    currentTarget: "confidence_graph",
    color: "#f59e0b",
    activity: "Checking null handling, join cardinality, and edge cases.",
    steps: [
      { id: "sanity", label: "Run sanity checks", status: "active" },
      { id: "cite", label: "Attach evidence", status: "pending" },
      { id: "final", label: "Finalize response", status: "pending" },
    ],
  },
];

export const sampleActivity: ActivityMessage[] = [
  {
    id: "1",
    agentId: "schema-scout",
    tone: "success",
    timestamp: "00:04",
    message: "Found primary join path through customer_id and order_id.",
  },
  {
    id: "2",
    agentId: "query-runner",
    tone: "info",
    timestamp: "00:08",
    message: "Query plan reduced scanned partitions from 42 to 7.",
  },
  {
    id: "3",
    agentId: "answer-analyst",
    tone: "info",
    timestamp: "00:11",
    message: "Detected regional variance in Q4 answer candidates.",
  },
  {
    id: "4",
    agentId: "validator",
    tone: "warning",
    timestamp: "00:14",
    message: "Rechecking one outlier before final response.",
  },
];
