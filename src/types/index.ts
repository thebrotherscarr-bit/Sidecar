/**
 * Manjuel Loop Runner Types
 * Core interfaces for Manjuel's recursive self-improvement loops executed
 * through Atlas release v0.2.6 with Secondbrain Notes as contextual cache & scratchpad.
 */

export interface McpConfig {
  endpointUrl: string;
  authToken?: string;
  timeoutMs: number;
  autoReconnect: boolean;
}

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    parent_model?: string;
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaStatus {
  running: boolean;
  endpointUrl: string;
  latencyMs: number;
  models: OllamaModel[];
  selectedModel: string;
  roles: {
    atlasReasoning: string;
    manjuelExecution: string;
    jessterInvariants: string;
    embeddings: string;
  };
  message: string;
}

export interface McpToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  default?: any;
}

export interface McpTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, McpToolParameter>;
    required?: string[];
  };
  category: 'atlas' | 'manjuel' | 'jesster' | 'secondbrain' | 'filesystem' | 'git';
}

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  id: string | number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export type RepoId = 'atlas' | 'manjuel' | 'jesster';

export interface RepoMetadata {
  id: RepoId;
  name: string;
  fullName: string;
  role: string;
  description: string;
  currentRelease: string;
  releaseUrl: string;
  defaultBranch: string;
  localPath: string;
  healthStatus: 'nominal' | 'warning' | 'drift_detected';
  lastSync: string;
  itemCountLabel: string;
  itemCount: number;
}

export interface AtlasSchema {
  id: string;
  name: string;
  version: string;
  entityType: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  dependents: string[];
  lastModified: string;
}

export interface JessterInvariant {
  id: string;
  name: string;
  ruleCategory: 'schema_parity' | 'mcp_conformance' | 'dependency_cycle' | 'security_rule';
  description: string;
  assertionExpression: string;
  targetRepos: RepoId[];
  status: 'passing' | 'failing' | 'warning';
  lastChecked: string;
  failureMessage?: string;
}

export interface FileDiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: {
    type: 'context' | 'addition' | 'deletion';
    content: string;
    oldLineNumber?: number;
    newLineNumber?: number;
  }[];
}

export interface FilePatch {
  filePath: string;
  repo: RepoId;
  operation: 'modify' | 'create' | 'delete';
  hunks: FileDiffHunk[];
  rawDiff: string;
  summary: string;
}

export interface CachedContextNote {
  id: string;
  title: string;
  vaultPath: string;
  excerpt: string;
  tags: string[];
  lastModified: string;
}

export interface ScratchpadNote {
  id: string;
  title: string;
  vaultPath: string;
  content: string;
  activePass: number;
  updatedAt: string;
  cachedNotes: CachedContextNote[];
}

export interface IterationPass {
  passNumber: number;
  phase: 'cache_ingest' | 'synthesis' | 'simulated_verify' | 'refinement' | 'converged';
  title: string;
  summary: string;
  scratchpadEntry: string;
  patches: FilePatch[];
  invariantsEvaluated: number;
  invariantsPassed: number;
  invariantsFailed: number;
  blastRadiusScore: 'LOW' | 'MEDIUM' | 'HIGH';
  convergenceScore: number; // 0 - 100%
  durationMs: number;
  timestamp: string;
}

export interface LoopSession {
  id: string;
  directive: string;
  engine: 'ollama' | 'gemini';
  model: string;
  maxIterations: number;
  currentIteration: number;
  status: 'idle' | 'running' | 'paused' | 'converged';
  scratchpad: ScratchpadNote;
  passes: IterationPass[];
  createdAt: string;
  updatedAt: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  repo: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failure';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | null;
  startedAt: string;
  htmlUrl: string;
  durationSec: number;
}
