import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { RecursiveCanvas } from './components/RecursiveCanvas.tsx';
import { ScratchpadView } from './components/ScratchpadView.tsx';
import { AtlasSchemasView } from './components/AtlasSchemasView.tsx';
import { McpConsoleModal } from './components/McpConsoleModal.tsx';
import { OllamaModelsModal } from './components/OllamaModelsModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import {
  INITIAL_LOOP_SESSION,
  INITIAL_SCRATCHPAD,
  INITIAL_SCHEMAS,
  INITIAL_MCP_TOOLS,
} from './data/mockEcosystem.ts';
import {
  AtlasSchema,
  IterationPass,
  LoopSession,
  McpTool,
  OllamaStatus,
  ScratchpadNote,
} from './types/index.ts';
import { McpServerStatus } from './server/mcpClient.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'scratchpad' | 'schemas'>('cockpit');

  // Configuration state stored in localStorage
  const [mcpEndpoint, setMcpEndpoint] = useState(() => localStorage.getItem('sb_mcp_endpoint') || 'http://localhost:3001');
  const [mcpToken, setMcpToken] = useState(() => localStorage.getItem('sb_mcp_token') || '');
  const [ollamaEndpoint, setOllamaEndpoint] = useState(() => localStorage.getItem('sb_ollama_endpoint') || 'http://localhost:11434');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('sb_github_token') || '');

  // System status
  const [mcpStatus, setMcpStatus] = useState<McpServerStatus | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);

  // Core Loop & Notes State
  const [session, setSession] = useState<LoopSession>(INITIAL_LOOP_SESSION);
  const [scratchpad, setScratchpad] = useState<ScratchpadNote>(INITIAL_SCRATCHPAD);
  const [schemas, setSchemas] = useState<AtlasSchema[]>(INITIAL_SCHEMAS);
  const [tools, setTools] = useState<McpTool[]>(INITIAL_MCP_TOOLS);

  // Modals state
  const [isMcpConsoleOpen, setIsMcpConsoleOpen] = useState(false);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Execution states
  const [isStepping, setIsStepping] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Save settings helper
  const handleSaveSettings = () => {
    localStorage.setItem('sb_mcp_endpoint', mcpEndpoint);
    localStorage.setItem('sb_mcp_token', mcpToken);
    localStorage.setItem('sb_ollama_endpoint', ollamaEndpoint);
    localStorage.setItem('sb_github_token', githubToken);
    pollServices();
  };

  // Poll local MCP and local Ollama
  const pollServices = async () => {
    // 1. Poll MCP
    try {
      const res = await fetch('/api/mcp/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpointUrl: mcpEndpoint, authToken: mcpToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setMcpStatus(data);
      }
    } catch {
      // Offline fallback
    }

    // 2. Poll Ollama
    try {
      const res = await fetch('/api/ollama/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpointUrl: ollamaEndpoint }),
      });
      if (res.ok) {
        const data = await res.json();
        setOllamaStatus(data);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    pollServices();
    const interval = setInterval(pollServices, 12000);
    return () => clearInterval(interval);
  }, [mcpEndpoint, ollamaEndpoint, mcpToken]);

  // Handler: Step Loop Pass (N -> N+1)
  const handleStepLoop = async (directive: string, engine: 'ollama' | 'gemini', model: string) => {
    setIsStepping(true);
    const nextPassNumber = session.passes.length + 1;

    try {
      const res = await fetch('/api/loop/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive,
          passNumber: nextPassNumber,
          engine,
          model,
          endpointUrl: ollamaEndpoint,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newPass: IterationPass = data.pass;
        const updatedScratchpad: ScratchpadNote = data.updatedScratchpad;

        setSession((prev) => ({
          ...prev,
          directive,
          engine,
          model,
          currentIteration: nextPassNumber,
          status: newPass.phase === 'converged' ? 'converged' : 'running',
          passes: [...prev.passes, newPass],
        }));

        setScratchpad(updatedScratchpad);
      }
    } catch (err) {
      console.error('Pass step error:', err);
    } finally {
      setIsStepping(false);
    }
  };

  // Handler: Auto-Run Loop
  const handleAutoRun = async (directive: string, engine: 'ollama' | 'gemini', model: string) => {
    await handleStepLoop(directive, engine, model);
  };

  // Handler: Update Scratchpad Note
  const handleUpdateScratchpad = async (newContent: string) => {
    try {
      const res = await fetch('/api/scratchpad/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (res.ok) {
        const data = await res.json();
        setScratchpad(data.scratchpad);
      }
    } catch (err) {
      console.error('Scratchpad update failed:', err);
    }
  };

  // Handler: Apply locally via Secondbrain MCP
  const handleApplyLocalMcp = async (pass: IterationPass) => {
    setIsApplying(true);
    try {
      await fetch('/api/loop/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'mcp_local',
          endpointUrl: mcpEndpoint,
          rawDiff: pass.patches.map((p) => p.rawDiff).join('\n'),
        }),
      });
    } catch (err) {
      console.error('Local apply failed:', err);
    } finally {
      setIsApplying(false);
    }
  };

  // Handler: Open GitHub PR
  const handleApplyGitHubPr = async (pass: IterationPass) => {
    setIsApplying(true);
    try {
      await fetch('/api/loop/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'github_pr',
          title: pass.title,
          repo: 'Atlas',
        }),
      });
    } catch (err) {
      console.error('GitHub PR failed:', err);
    } finally {
      setIsApplying(false);
    }
  };

  // Handler: Execute arbitrary MCP Tool
  const handleExecuteTool = async (toolName: string, args: Record<string, any>) => {
    const res = await fetch('/api/mcp/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpointUrl: mcpEndpoint,
        authToken: mcpToken,
        request: {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args,
          },
        },
      }),
    });
    return res.json();
  };

  // Handler: Test Prompt on Local Ollama
  const handleTestOllamaPrompt = async (model: string, prompt: string) => {
    const res = await fetch('/api/ollama/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        endpointUrl: ollamaEndpoint,
      }),
    });
    const data = await res.json();
    return data.response;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-200">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mcpStatus={mcpStatus}
        ollamaStatus={ollamaStatus}
        onOpenMcpConsole={() => setIsMcpConsoleOpen(true)}
        onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {activeTab === 'cockpit' && (
          <RecursiveCanvas
            session={session}
            scratchpad={scratchpad}
            ollamaStatus={ollamaStatus}
            onStepLoop={handleStepLoop}
            onAutoRun={handleAutoRun}
            onApplyLocalMcp={handleApplyLocalMcp}
            onApplyGitHubPr={handleApplyGitHubPr}
            isStepping={isStepping}
            isApplying={isApplying}
          />
        )}

        {activeTab === 'scratchpad' && (
          <ScratchpadView
            scratchpad={scratchpad}
            onUpdateScratchpad={handleUpdateScratchpad}
            isSteppingLoop={isStepping}
          />
        )}

        {activeTab === 'schemas' && (
          <AtlasSchemasView schemas={schemas} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        Manjuel Loop Runner · Atlas Base v0.2.6 · Secondbrain Notes Cache & Scratchpad · Serving Ollama on 11434 · MCP on 3001
      </footer>

      {/* Modals */}
      <McpConsoleModal
        isOpen={isMcpConsoleOpen}
        onClose={() => setIsMcpConsoleOpen(false)}
        mcpStatus={mcpStatus}
        tools={tools}
        onExecuteTool={handleExecuteTool}
      />

      <OllamaModelsModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        ollamaStatus={ollamaStatus}
        onRefresh={pollServices}
        onTestPrompt={handleTestOllamaPrompt}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mcpEndpoint={mcpEndpoint}
        setMcpEndpoint={setMcpEndpoint}
        mcpToken={mcpToken}
        setMcpToken={setMcpToken}
        ollamaEndpoint={ollamaEndpoint}
        setOllamaEndpoint={setOllamaEndpoint}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
