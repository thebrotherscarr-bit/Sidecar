import {
  AtlasSchema,
  CachedContextNote,
  GitHubWorkflowRun,
  IterationPass,
  JessterInvariant,
  LoopSession,
  McpTool,
  RepoMetadata,
  ScratchpadNote,
} from '../types/index.ts';

export const INITIAL_REPOS: RepoMetadata[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    fullName: 'thebrotherscarr-bit/Atlas',
    role: 'Blueprint & Schema Base Foundation',
    description: 'System architecture graphs, ontology schemas, and invariant contracts that ground the recursive loop.',
    currentRelease: 'v0.2.6',
    releaseUrl: 'https://github.com/thebrotherscarr-bit/Atlas/releases/tag/v0.2.6',
    defaultBranch: 'main',
    localPath: '~/secondbrain-workspace/Atlas',
    healthStatus: 'nominal',
    lastSync: '1 minute ago',
    itemCountLabel: 'Registered Schemas',
    itemCount: 14,
  },
  {
    id: 'manjuel',
    name: 'Manjuel',
    fullName: 'thebrotherscarr-bit/Manjuel',
    role: 'Recursive Self-Improvement Engine',
    description: 'Executes autonomous iterative refinement cycles, evaluates invariants, and mutates code/schemas.',
    currentRelease: 'v0.4.1',
    releaseUrl: 'https://github.com/thebrotherscarr-bit/Manjuel/releases',
    defaultBranch: 'main',
    localPath: '~/secondbrain-workspace/Manjuel',
    healthStatus: 'nominal',
    lastSync: 'Just now',
    itemCountLabel: 'Recursive Loops Run',
    itemCount: 18,
  },
  {
    id: 'jesster',
    name: 'Jesster',
    fullName: 'thebrotherscarr-bit/Jesster',
    role: 'Invariant Verification Harness',
    description: 'Contract parity assertions and regression test suites executed during loop simulation phases.',
    currentRelease: 'secondbrain-b39',
    releaseUrl: 'https://github.com/thebrotherscarr-bit/Jesster/releases/tag/secondbrain-b39',
    defaultBranch: 'main',
    localPath: '~/secondbrain-workspace/Jesster',
    healthStatus: 'nominal',
    lastSync: '3 minutes ago',
    itemCountLabel: 'Invariant Rules',
    itemCount: 22,
  },
];

export const INITIAL_CACHED_NOTES: CachedContextNote[] = [
  {
    id: 'note-01',
    title: 'Atlas v0.2.6 Architectural Directives',
    vaultPath: 'Notes/Architecture/atlas-v026-spec.md',
    excerpt: 'Atlas v0.2.6 establishes strict contract boundaries between the core ontology and execution runtimes. All entity definitions must expose an explicit invariants array binding to Jesster rules.',
    tags: ['atlas', 'architecture', 'invariants', 'v0.2.6'],
    lastModified: '2026-10-25T14:30:00Z',
  },
  {
    id: 'note-02',
    title: 'Manjuel Self-Heal & Recursion Limits',
    vaultPath: 'Notes/Workflows/manjuel-recursion-safety.md',
    excerpt: 'To avoid infinite regress in self-improving loops, every loop execution must enforce a strict budget ceiling (default N=3). Intermediate hypotheses must be flushed to the scratchpad note.',
    tags: ['manjuel', 'safety', 'recursion', 'scratchpad'],
    lastModified: '2026-10-24T18:15:00Z',
  },
  {
    id: 'note-03',
    title: 'Secondbrain MCP Bridge Specifications',
    vaultPath: 'Notes/Integrations/mcp-server-spec.md',
    excerpt: 'Secondbrain serves as the local desktop host providing JSON-RPC 2.0 endpoints for graph querying, filesystem patch applications, and scratchpad note synchronizations.',
    tags: ['secondbrain', 'mcp', 'json-rpc'],
    lastModified: '2026-10-26T07:10:00Z',
  },
];

export const INITIAL_SCRATCHPAD: ScratchpadNote = {
  id: 'scratchpad-active-session',
  title: 'Manjuel Recursive Loop Working Scratchpad',
  vaultPath: 'Notes/Scratchpad/active-loop-scratchpad.md',
  activePass: 2,
  updatedAt: '2026-10-26T08:55:00Z',
  cachedNotes: INITIAL_CACHED_NOTES,
  content: `# Manjuel Working Scratchpad: Recursive Pass N=2

## Active Objective
Harmonize Atlas v0.2.6 ThoughtNodeSchema with Manjuel pipeline workers, binding Jesster invariant assertions and eliminating schema drift.

## Ingested Context Notes (Secondbrain Vault)
- **Atlas v0.2.6 Architectural Directives**: Strict contract boundaries; entity schemas require explicit invariant array bindings.
- **Manjuel Self-Heal & Recursion Limits**: Safety ceiling N=3; intermediate hypotheses logged here for continuity.
- **Secondbrain MCP Bridge**: fs.apply_patch tool ready for local application upon convergence.

## Iteration Pass 1 Observations
- Analyzed: \`src/schemas/ThoughtNodeSchema.ts\` (Atlas) vs. \`src/workers/thought_indexer.worker.ts\` (Manjuel).
- Discovered: Manjuel indexer drops the newly added \`invariants: string[]\` field from Atlas v0.2.6.
- Invariant Status: 21/22 Passing. Violation on rule \`jesster.inv.schema_parity_v026\`.

## Iteration Pass 2 Synthesis & Refinements
- Drafted fix: Propagated \`invariants\` field in \`thought_indexer.worker.ts\`.
- Added defensive fallback: \`invariants: rawNode.invariants ?? []\`.
- Simulated Jesster test run: All 22/22 invariants now PASSING.
- Blast radius calculated: LOW (2 files touched, 0 circular dependencies).
- Convergence status: Ready for manual review and apply.`,
};

export const INITIAL_PASSES: IterationPass[] = [
  {
    passNumber: 1,
    phase: 'simulated_verify',
    title: 'Pass 1: Schema Drift Discovery & Initial Synthesis',
    summary: 'Ingested Atlas v0.2.6 ThoughtNodeSchema and detected missing invariant metadata propagation in Manjuel indexer.',
    scratchpadEntry: 'Pass 1 initialized scratchpad note. Flagged Jesster parity invariant breach.',
    invariantsEvaluated: 22,
    invariantsPassed: 21,
    invariantsFailed: 1,
    blastRadiusScore: 'LOW',
    convergenceScore: 68,
    durationMs: 420,
    timestamp: '2026-10-26T08:52:00Z',
    patches: [
      {
        filePath: 'src/schemas/ThoughtNodeSchema.ts',
        repo: 'atlas',
        operation: 'modify',
        summary: 'Add invariant bindings to ThoughtNodeSchema interface',
        rawDiff: `--- a/src/schemas/ThoughtNodeSchema.ts
+++ b/src/schemas/ThoughtNodeSchema.ts
@@ -14,6 +14,8 @@ export interface ThoughtNodeSchema {
   content: string;
   embedding?: number[];
   parentBlueprintId?: string;
+  /** Jesster invariant assertion IDs bound to this node */
+  invariants: string[];
   updatedAt: string;
 }`,
        hunks: [
          {
            oldStart: 14,
            oldLines: 6,
            newStart: 14,
            newLines: 8,
            lines: [
              { type: 'context', content: '  content: string;', oldLineNumber: 14, newLineNumber: 14 },
              { type: 'context', content: '  embedding?: number[];', oldLineNumber: 15, newLineNumber: 15 },
              { type: 'context', content: '  parentBlueprintId?: string;', oldLineNumber: 16, newLineNumber: 16 },
              { type: 'addition', content: '  /** Jesster invariant assertion IDs bound to this node */', newLineNumber: 17 },
              { type: 'addition', content: '  invariants: string[];', newLineNumber: 18 },
              { type: 'context', content: '  updatedAt: string;', oldLineNumber: 17, newLineNumber: 19 },
              { type: 'context', content: '}', oldLineNumber: 18, newLineNumber: 20 },
            ],
          },
        ],
      },
    ],
  },
  {
    passNumber: 2,
    phase: 'converged',
    title: 'Pass 2: Invariant Realignment & Worker Pipeline Parity',
    summary: 'Refined worker pipeline to consume invariants metadata, satisfying all 22 Jesster contracts with 100% convergence.',
    scratchpadEntry: 'Pass 2 updated scratchpad with verified invariant assertions. Loop converged nominal.',
    invariantsEvaluated: 22,
    invariantsPassed: 22,
    invariantsFailed: 0,
    blastRadiusScore: 'LOW',
    convergenceScore: 100,
    durationMs: 380,
    timestamp: '2026-10-26T08:55:00Z',
    patches: [
      {
        filePath: 'src/schemas/ThoughtNodeSchema.ts',
        repo: 'atlas',
        operation: 'modify',
        summary: 'Add invariant bindings to ThoughtNodeSchema interface',
        rawDiff: `--- a/src/schemas/ThoughtNodeSchema.ts
+++ b/src/schemas/ThoughtNodeSchema.ts
@@ -14,6 +14,8 @@ export interface ThoughtNodeSchema {
   content: string;
   embedding?: number[];
   parentBlueprintId?: string;
+  /** Jesster invariant assertion IDs bound to this node */
+  invariants: string[];
   updatedAt: string;
 }`,
        hunks: [
          {
            oldStart: 14,
            oldLines: 6,
            newStart: 14,
            newLines: 8,
            lines: [
              { type: 'context', content: '  content: string;', oldLineNumber: 14, newLineNumber: 14 },
              { type: 'context', content: '  embedding?: number[];', oldLineNumber: 15, newLineNumber: 15 },
              { type: 'context', content: '  parentBlueprintId?: string;', oldLineNumber: 16, newLineNumber: 16 },
              { type: 'addition', content: '  /** Jesster invariant assertion IDs bound to this node */', newLineNumber: 17 },
              { type: 'addition', content: '  invariants: string[];', newLineNumber: 18 },
              { type: 'context', content: '  updatedAt: string;', oldLineNumber: 17, newLineNumber: 19 },
              { type: 'context', content: '}', oldLineNumber: 18, newLineNumber: 20 },
            ],
          },
        ],
      },
      {
        filePath: 'src/workers/thought_indexer.worker.ts',
        repo: 'manjuel',
        operation: 'modify',
        summary: 'Propagate invariant metadata during indexing pipeline pass',
        rawDiff: `--- a/src/workers/thought_indexer.worker.ts
+++ b/src/workers/thought_indexer.worker.ts
@@ -28,5 +28,6 @@ export async function indexThoughtNode(rawNode: RawInput): Promise<IndexedNode> {
     title: rawNode.title.trim(),
     content: rawNode.body,
+    invariants: rawNode.invariants ?? [],
     updatedAt: new Date().toISOString(),
   };
 }`,
        hunks: [
          {
            oldStart: 28,
            oldLines: 5,
            newStart: 28,
            newLines: 6,
            lines: [
              { type: 'context', content: '    title: rawNode.title.trim(),', oldLineNumber: 28, newLineNumber: 28 },
              { type: 'context', content: '    content: rawNode.body,', oldLineNumber: 29, newLineNumber: 29 },
              { type: 'addition', content: '    invariants: rawNode.invariants ?? [],', newLineNumber: 30 },
              { type: 'context', content: '    updatedAt: new Date().toISOString(),', oldLineNumber: 30, newLineNumber: 31 },
              { type: 'context', content: '  };', oldLineNumber: 31, newLineNumber: 32 },
            ],
          },
        ],
      },
    ],
  },
];

export const INITIAL_LOOP_SESSION: LoopSession = {
  id: 'session-20261026-0850',
  directive: 'Harmonize Atlas v0.2.6 ThoughtNodeSchema with Manjuel pipeline workers and verify Jesster secondbrain-b39 invariants.',
  engine: 'ollama',
  model: 'qwen2.5-coder:7b',
  maxIterations: 3,
  currentIteration: 2,
  status: 'converged',
  scratchpad: INITIAL_SCRATCHPAD,
  passes: INITIAL_PASSES,
  createdAt: '2026-10-26T08:50:00Z',
  updatedAt: '2026-10-26T08:55:00Z',
};

export const INITIAL_SCHEMAS: AtlasSchema[] = [
  {
    id: 'atlas.entity.thought.v2',
    name: 'ThoughtNodeSchema',
    version: '0.2.6',
    entityType: 'CoreKnowledgeEntity',
    description: 'Fundamental thought node schema governing knowledge capture, semantic embeddings, and bidirectional links in Secondbrain.',
    fields: [
      { name: 'id', type: 'UUIDv4', required: true, description: 'Globally unique node identifier' },
      { name: 'title', type: 'string', required: true, description: 'Concise editorial thought title' },
      { name: 'content', type: 'MarkdownString', required: true, description: 'Body text with wikilinks' },
      { name: 'embedding', type: 'Float32Array[768]', required: false, description: 'Dense vector representation' },
      { name: 'parentBlueprintId', type: 'string', required: false, description: 'Associated Atlas blueprint ID' },
      { name: 'invariants', type: 'string[]', required: true, description: 'Bound Jesster invariant rule IDs' },
      { name: 'updatedAt', type: 'ISO8601Timestamp', required: true, description: 'Last revision timestamp' },
    ],
    dependents: ['manjuel.pipeline.thought_indexer', 'jesster.rule.no_orphaned_thoughts'],
    lastModified: '2026-10-24T14:22:00Z',
  },
  {
    id: 'atlas.contract.mcp_bridge.v1',
    name: 'McpBridgeContract',
    version: '0.2.6',
    entityType: 'SystemInterfaceSpec',
    description: 'Interface contract specifying JSON-RPC 2.0 tool and resource registration between Secondbrain and sidecar extensions.',
    fields: [
      { name: 'protocolVersion', type: 'SemVer', required: true, description: 'MCP standard version compatibility' },
      { name: 'rpcTransport', type: 'HTTP_REST_JSONRPC | SSE', required: true, description: 'Supported transport mechanisms' },
      { name: 'capabilities', type: 'McpCapabilitiesMap', required: true, description: 'Supported MCP tool primitives' },
      { name: 'healthEndpoint', type: 'string', required: true, description: 'Liveness ping path' },
    ],
    dependents: ['manjuel.worker.mcp_dispatcher', 'jesster.test.rpc_conformance'],
    lastModified: '2026-10-25T09:10:00Z',
  },
  {
    id: 'atlas.ontology.agent_directive.v1',
    name: 'AgentDirectiveOntology',
    version: '0.2.6',
    entityType: 'BehavioralSpec',
    description: 'Specifies structured goal decomposition and tool constraints for Manjuel autonomous agents.',
    fields: [
      { name: 'directiveId', type: 'string', required: true, description: 'Unique directive tag' },
      { name: 'allowedToolCategories', type: 'string[]', required: true, description: 'Permitted MCP tool scopes' },
      { name: 'maxRecursionDepth', type: 'integer', required: true, description: 'Loop iteration ceiling' },
      { name: 'rollbackOnInvariantFailure', type: 'boolean', required: true, description: 'Auto-revert flag' },
    ],
    dependents: ['manjuel.loop.self_recursive_engine'],
    lastModified: '2026-10-26T07:45:00Z',
  },
];

export const INITIAL_INVARIANTS: JessterInvariant[] = [
  {
    id: 'jesster.inv.schema_parity_v026',
    name: 'Atlas v0.2.6 Interface Parity Assertion',
    ruleCategory: 'schema_parity',
    description: 'Guarantees that all Secondbrain data access objects implement the exact fields and nullability defined in Atlas v0.2.6 schemas.',
    assertionExpression: 'forall s in Atlas.schemas => TypescriptDefs[s.id].isSubsetOf(s.spec) && s.fields.every(f => f.present)',
    targetRepos: ['atlas', 'manjuel'],
    status: 'passing',
    lastChecked: 'Just now',
  },
  {
    id: 'jesster.inv.no_circular_dependencies',
    name: 'Triad Dependency Acyclicity Contract',
    ruleCategory: 'dependency_cycle',
    description: 'Ensures Atlas is pure schema/specification (zero runtime imports of Manjuel/Jesster), Manjuel imports Atlas only, Jesster evaluates both.',
    assertionExpression: 'Imports(Atlas) intersect (Imports(Manjuel) union Imports(Jesster)) == emptySet',
    targetRepos: ['atlas', 'manjuel', 'jesster'],
    status: 'passing',
    lastChecked: '1 minute ago',
  },
  {
    id: 'jesster.inv.self_healing_bounded_recursion',
    name: 'Self-Recursive Loop Safety Ceiling',
    ruleCategory: 'security_rule',
    description: 'Prevents infinite self-modification cascade loops by capping recursive execution passes at N=3 without human approval.',
    assertionExpression: 'currentRun.consecutiveAutonomousPasses <= 3 || requireUserReviewPrompt()',
    targetRepos: ['manjuel', 'jesster'],
    status: 'passing',
    lastChecked: '2 minutes ago',
  },
];

export const INITIAL_MCP_TOOLS: McpTool[] = [
  {
    name: 'secondbrain.query_graph',
    description: 'Queries the Secondbrain knowledge and architecture graph for relationships between entities.',
    category: 'secondbrain',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Semantic or node filter query' },
        depth: { type: 'number', description: 'Graph traversal depth (1-4)', default: 2 },
      },
      required: ['query'],
    },
  },
  {
    name: 'fs.apply_patch',
    description: 'Applies an audited multi-file unified patch to local Secondbrain workspace via MCP.',
    category: 'filesystem',
    parameters: {
      type: 'object',
      properties: {
        patchContent: { type: 'string', description: 'Unified diff content' },
        backupFirst: { type: 'boolean', default: true },
      },
      required: ['patchContent'],
    },
  },
];

export const INITIAL_WORKFLOW_RUNS: GitHubWorkflowRun[] = [
  {
    id: 9283711,
    name: 'Atlas Schema Invariant CI',
    repo: 'thebrotherscarr-bit/Atlas',
    branch: 'release/v0.2.6',
    commitHash: '7f9a2bc',
    commitMessage: 'release: Atlas v0.2.6 schema contract registry upgrade',
    status: 'completed',
    conclusion: 'success',
    startedAt: '2026-10-26T07:15:00Z',
    htmlUrl: 'https://github.com/thebrotherscarr-bit/Atlas/actions/runs/9283711',
    durationSec: 42,
  },
];
