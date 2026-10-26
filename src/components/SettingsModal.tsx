import React, { useState } from 'react';
import { X, Settings, Key, Check, Server, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcpEndpoint: string;
  setMcpEndpoint: (url: string) => void;
  mcpToken: string;
  setMcpToken: (token: string) => void;
  ollamaEndpoint: string;
  setOllamaEndpoint: (url: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  mcpEndpoint,
  setMcpEndpoint,
  mcpToken,
  setMcpToken,
  ollamaEndpoint,
  setOllamaEndpoint,
  githubToken,
  setGithubToken,
  onSave,
}) => {
  if (!isOpen) return null;

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-300" />
            <h2 className="text-sm font-semibold text-white">Sidecar Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* MCP Endpoint */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-300">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Secondbrain Local MCP Endpoint
            </label>
            <input
              type="text"
              value={mcpEndpoint}
              onChange={(e) => setMcpEndpoint(e.target.value)}
              placeholder="http://localhost:3001"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              Direct connection to the Model Context Protocol bridge built into your Secondbrain desktop app.
            </p>
          </div>

          {/* MCP Auth Token */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-300">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              MCP Bearer Token (Optional)
            </label>
            <input
              type="password"
              value={mcpToken}
              onChange={(e) => setMcpToken(e.target.value)}
              placeholder="Bearer token if enabled in Secondbrain config"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-slate-700"
            />
          </div>

          {/* Ollama Endpoint */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Ollama Desktop Engine Endpoint
            </label>
            <input
              type="text"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500">
              Local Ollama server hosting your pulled models for private, zero-telemetry architectural synthesis.
            </p>
          </div>

          {/* GitHub PAT */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-300">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              GitHub Personal Access Token (thebrotherscarr-bit)
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-white focus:outline-none focus:border-slate-700"
            />
            <p className="text-[11px] text-slate-500">
              Used to inspect private repos (Atlas, Manjuel, Jesster), trigger CI workflows, and create Pull Requests.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/60 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
            {saved ? 'Saved!' : 'Save & Sync'}
          </button>
        </div>
      </div>
    </div>
  );
};
