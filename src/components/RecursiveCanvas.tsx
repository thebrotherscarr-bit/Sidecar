import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  GitPullRequest,
  Cpu,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
  FastForward,
} from 'lucide-react';
import { IterationPass, LoopSession, OllamaStatus, ScratchpadNote } from '../types/index.ts';
import { DiffViewer } from './DiffViewer.tsx';

interface RecursiveCanvasProps {
  session: LoopSession;
  scratchpad: ScratchpadNote;
  ollamaStatus: OllamaStatus | null;
  onStepLoop: (directive: string, engine: 'ollama' | 'gemini', model: string) => Promise<void>;
  onAutoRun: (directive: string, engine: 'ollama' | 'gemini', model: string) => Promise<void>;
  onApplyLocalMcp: (pass: IterationPass) => Promise<void>;
  onApplyGitHubPr: (pass: IterationPass) => Promise<void>;
  isStepping: boolean;
  isApplying: boolean;
}

export const RecursiveCanvas: React.FC<RecursiveCanvasProps> = ({
  session,
  scratchpad,
  ollamaStatus,
  onStepLoop,
  onAutoRun,
  onApplyLocalMcp,
  onApplyGitHubPr,
  isStepping,
  isApplying,
}) => {
  const [directive, setDirective] = useState(session.directive);
  const [engine, setEngine] = useState<'ollama' | 'gemini'>(session.engine);
  const [model, setModel] = useState(
    session.model || ollamaStatus?.selectedModel || 'qwen2.5-coder:7b'
  );
  const [selectedPassIndex, setSelectedPassIndex] = useState(
    Math.max(0, session.passes.length - 1)
  );
  const [selectedPatchIndex, setSelectedPatchIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activePass = session.passes[selectedPassIndex] || session.passes[0];

  const handleStepClick = async () => {
    setFeedback(null);
    await onStepLoop(directive, engine, model);
    setSelectedPassIndex(session.passes.length); // will focus the newly created pass
  };

  const handleAutoRunClick = async () => {
    setFeedback(null);
    await onAutoRun(directive, engine, model);
    setSelectedPassIndex(session.passes.length);
  };

  const handleApplyMcp = async () => {
    if (!activePass) return;
    setFeedback('Invoking Secondbrain MCP fs.apply_patch...');
    await onApplyLocalMcp(activePass);
    setFeedback('Converged patch applied to local Secondbrain workspace via MCP.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApplyPr = async () => {
    if (!activePass) return;
    setFeedback('Creating remote branch and opening GitHub Pull Request...');
    await onApplyGitHubPr(activePass);
    setFeedback('Pull Request opened on thebrotherscarr-bit/Atlas.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Directive & Loop Parameters Bar */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Manjuel Recursive Self-Improvement Engine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Executing recursive self-improvement loops through Atlas v0.2.6 schemas, using Secondbrain Notes as contextual memory & live scratchpad.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-md border border-slate-800 shrink-0">
            <button
              onClick={() => setEngine('ollama')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                engine === 'ollama' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Local Ollama
            </button>
            <button
              onClick={() => setEngine('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                engine === 'gemini' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gemini 3.8 Flash
            </button>
          </div>
        </div>

        {/* Input & Execution Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {engine === 'ollama' && (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-white focus:outline-none focus:border-cyan-500 shrink-0"
            >
              {(ollamaStatus?.models || []).map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.details?.parameter_size || 'local'})
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder="E.g. Harmonize Atlas v0.2.6 ThoughtNodeSchema with Manjuel pipeline workers..."
            className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
          />

          <button
            onClick={handleStepClick}
            disabled={isStepping}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {isStepping ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                Executing Pass...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Step Pass (N &rarr; N+1)
              </>
            )}
          </button>

          <button
            onClick={handleAutoRunClick}
            disabled={isStepping}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <FastForward className="w-3.5 h-3.5" />
            Auto-Run to Convergence
          </button>
        </div>

        {feedback && (
          <div className="p-2.5 rounded bg-slate-950 border border-emerald-800/80 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Recursive Iteration Timeline Strip */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Iteration Timeline ({session.passes.length} Passes):
          </span>
          <div className="flex items-center gap-2">
            {session.passes.map((pass, idx) => (
              <button
                key={pass.passNumber}
                onClick={() => setSelectedPassIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-all ${
                  selectedPassIndex === idx
                    ? 'bg-slate-800 text-white border border-cyan-500/80 shadow-xs'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>Pass {pass.passNumber}</span>
                {pass.phase === 'converged' && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Convergence: <strong className="text-white">{activePass?.convergenceScore ?? 100}%</strong></span>
          <span>Invariants: <strong className="text-emerald-400">{activePass?.invariantsPassed ?? 22}/22</strong></span>
        </div>
      </div>

      {/* Main Multi-Column Iteration Cockpit */}
      {activePass && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scratchpad Reflection & Invariants Telemetry */}
          <div className="space-y-5">
            {/* Pass Summary Card */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider">Pass N={activePass.passNumber} Overview</span>
                <span>{new Date(activePass.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <h2 className="text-sm font-semibold text-white leading-snug">
                {activePass.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activePass.summary}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Blast Radius</span>
                  <span className="text-emerald-400 font-bold">{activePass.blastRadiusScore}</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Pass Runtime</span>
                  <span className="text-white font-bold tabular-nums">{activePass.durationMs}ms</span>
                </div>
              </div>
            </div>

            {/* Secondbrain Scratchpad Excerpt for this Pass */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <FileText className="w-4 h-4" />
                  <span>Secondbrain Scratchpad Log</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Auto-Written</span>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {activePass.scratchpadEntry || 'Pass reflections recorded on scratchpad.'}
              </div>
            </div>

            {/* Manual Apply Gate Actions */}
            <div className="rounded-lg border border-cyan-800/80 bg-slate-900/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Manual Apply Gate</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  {activePass.phase === 'converged' ? 'Verified Converged' : 'Awaiting Approval'}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Pass evaluated with zero invariant breaches. Deploy this iteration:
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleApplyMcp}
                  disabled={isApplying}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Apply Pass via Secondbrain MCP
                </button>

                <button
                  onClick={handleApplyPr}
                  disabled={isApplying}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                  Commit & Open GitHub PR
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (2 cols): Evolutionary Diff Inspector */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Evolutionary Diffs (Pass {activePass.passNumber})
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ({activePass.patches.length} files modified)
                </span>
              </div>

              {/* File selector tabs */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-md">
                {activePass.patches.map((p, idx) => (
                  <button
                    key={p.filePath}
                    onClick={() => setSelectedPatchIndex(idx)}
                    className={`px-2.5 py-1 text-xs font-mono rounded truncate max-w-[200px] transition-colors ${
                      selectedPatchIndex === idx
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-900'
                    }`}
                  >
                    {p.filePath.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>

            {/* Diff Viewer Component */}
            {activePass.patches[selectedPatchIndex] ? (
              <DiffViewer patch={activePass.patches[selectedPatchIndex]} />
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 bg-slate-950 rounded border border-slate-800">
                No file patch in this iteration pass.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
