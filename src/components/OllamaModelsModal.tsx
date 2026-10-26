import React, { useState } from 'react';
import { X, Cpu, CheckCircle2, RotateCcw, Play, HardDrive, Sparkles } from 'lucide-react';
import { OllamaModel, OllamaStatus } from '../types';

interface OllamaModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ollamaStatus: OllamaStatus | null;
  onRefresh: () => Promise<void>;
  onTestPrompt: (model: string, prompt: string) => Promise<string>;
}

export const OllamaModelsModal: React.FC<OllamaModelsModalProps> = ({
  isOpen,
  onClose,
  ollamaStatus,
  onRefresh,
  onTestPrompt,
}) => {
  if (!isOpen) return null;

  const [testModel, setTestModel] = useState<string>(
    ollamaStatus?.selectedModel || 'qwen2.5-coder:7b'
  );
  const [testPrompt, setTestPrompt] = useState('Analyze Atlas v0.2.6 ThoughtNodeSchema and verify parity with Jesster secondbrain-b39.');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const models: OllamaModel[] = ollamaStatus?.models || [];

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestPrompt(testModel, testPrompt);
      setTestResult(res);
    } catch (err: any) {
      setTestResult(`Error: ${err.message || 'Inference error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Local Ollama Desktop Model Registry</h2>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              {ollamaStatus?.running ? 'Connected (11434)' : 'Configured Pulled Profiles'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/40 border border-slate-800">
            <div>
              <p className="text-xs text-slate-300">
                Ollama Desktop serves local LLMs to your Secondbrain and Atlas architecture loop.
                All inference runs completely on-device without external telemetry.
              </p>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                Endpoint: {ollamaStatus?.endpointUrl || 'http://localhost:11434'}
              </span>
            </div>

            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="px-3 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Probe Port 11434
            </button>
          </div>

          {/* Pulled Models List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Installed & Pulled Models ({models.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {models.map((m) => (
                <div
                  key={m.name}
                  className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{m.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {m.details?.quantization_level || 'GGUF'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-600 block text-[10px]">Parameters</span>
                      <span>{m.details?.parameter_size || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px]">Disk Size</span>
                      <span className="tabular-nums">{formatBytes(m.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Assignments */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Triad Architectural Model Assignments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Atlas Blueprint Reasoning</span>
                <span className="text-cyan-300 font-mono text-xs mt-1 block">
                  {ollamaStatus?.roles.atlasReasoning || 'qwen2.5-coder:7b'}
                </span>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Manjuel Execution Codegen</span>
                <span className="text-purple-300 font-mono text-xs mt-1 block">
                  {ollamaStatus?.roles.manjuelExecution || 'deepseek-coder:6.7b'}
                </span>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Jesster Invariant Assertion</span>
                <span className="text-emerald-300 font-mono text-xs mt-1 block">
                  {ollamaStatus?.roles.jessterInvariants || 'qwen2.5-coder:7b'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Inference Test Runner */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Test Local Inference
            </h3>

            <div className="flex gap-2">
              <select
                value={testModel}
                onChange={(e) => setTestModel(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-white"
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-white"
              />

              <button
                onClick={handleTest}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded disabled:bg-cyan-900 shrink-0"
              >
                {isTesting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Run Test
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                {testResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
