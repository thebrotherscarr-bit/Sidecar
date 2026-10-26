import React from 'react';
import { Cpu, Server, Settings, Terminal, Sparkles } from 'lucide-react';
import { McpServerStatus } from '../server/mcpClient.ts';
import { OllamaStatus } from '../types/index.ts';

interface HeaderProps {
  activeTab: 'cockpit' | 'scratchpad' | 'schemas';
  onSelectTab: (tab: 'cockpit' | 'scratchpad' | 'schemas') => void;
  mcpStatus: McpServerStatus | null;
  ollamaStatus: OllamaStatus | null;
  onOpenMcpConsole: () => void;
  onOpenOllamaModal: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  mcpStatus,
  ollamaStatus,
  onOpenMcpConsole,
  onOpenOllamaModal,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-baseline gap-2.5 shrink-0">
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          Manjuel Loop Runner
        </span>
        <span className="text-xs text-slate-500 font-mono tracking-tight whitespace-nowrap hidden sm:inline">
          Atlas v0.2.6 · Secondbrain Notes Cache & Scratchpad
        </span>
      </div>

      {/* Zone 2: 3 clean single-line nav tabs */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
        <button
          onClick={() => onSelectTab('cockpit')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'cockpit'
              ? 'bg-slate-800 text-white font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Active Loop Cockpit
        </button>
        <button
          onClick={() => onSelectTab('scratchpad')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'scratchpad'
              ? 'bg-slate-800 text-white font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Scratchpad & Notes Cache
        </button>
        <button
          onClick={() => onSelectTab('schemas')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'schemas'
              ? 'bg-slate-800 text-white font-semibold shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Atlas v0.2.6 Schemas
        </button>
      </nav>

      {/* Zone 3: Primary action & live status cluster */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Ollama Local Engine Status */}
        <button
          onClick={onOpenOllamaModal}
          title="Local Ollama Desktop Status & Models"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-slate-400">Ollama:</span>
          <span className="text-white truncate max-w-[120px]">
            {ollamaStatus?.selectedModel || 'qwen2.5-coder'}
          </span>
        </button>

        {/* Secondbrain MCP Status */}
        <button
          onClick={onOpenMcpConsole}
          title="Secondbrain MCP Bridge Console"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline text-slate-400">MCP:</span>
          <span className="text-emerald-400 font-semibold">
            {mcpStatus?.connected ? '3001 Live' : 'Sandbox'}
          </span>
          <Terminal className="w-3 h-3 text-slate-500 ml-0.5" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Loop Runner Settings"
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
