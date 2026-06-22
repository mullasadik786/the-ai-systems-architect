export type NodeType = 'input' | 'agent' | 'router' | 'merger' | 'critic';

export interface AgentNode {
  id: string;
  name: string;
  type: NodeType;
  role: string;
  systemInstruction: string;
  promptTemplate: string; // Dynamic placeholder, e.g., "Review this and improve it:\n{{input}}"
  model: string;
  temperature: number;
  position: { x: number; y: number };
  requireApproval?: boolean;
  retries?: number;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  condition?: string; // Optional routing condition for router nodes
}

export interface SwarmArchitecture {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  connections: Connection[];
}

export interface ExecutionStepLog {
  nodeId: string;
  nodeName: string;
  type: NodeType;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input: string;
  output?: string;
  durationMs?: number;
  tokensUsed?: number;
  error?: string;
}

export interface SwarmSimulationResult {
  architectureId: string;
  task: string;
  steps: ExecutionStepLog[];
  finalResponse: string;
  advisorFeedback?: {
    score: number; // 0-100 rating
    bottlenecks: string[];
    recommendations: string[];
  };
}

export interface DecomposedStep {
  stepId: string;
  stepName: string;
  description: string;
  suggestedAgentName: string;
  suggestedRole: string;
  criteria: string[];
}

export interface ActionIntegration {
  id: string;
  app: 'gmail' | 'jira' | 'slack' | 'github';
  actionName: string;
  status: 'idle' | 'triggered' | 'completed' | 'failed';
  configValue: string;
  activityLog: string[];
}

export interface MemorySegment {
  id: string;
  title: string;
  snippet: string;
  category: 'rule' | 'past_project' | 'compliance';
  embeddingSimilarity?: number;
}
