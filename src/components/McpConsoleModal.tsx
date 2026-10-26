import React, { useState } from 'react';
import { X, Play, RotateCcw, Server } from 'lucide-react';
import { McpTool } from '../types';
import { McpServerStatus } from '../server/mcpClient';

interface McpConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcpStatus: McpServerStatus | null;
  tools: McpTool[];
  onExecuteTool: (toolName: string, args: Record<string, any>) => Promise<any>;
}

export const McpConsoleModal: React.FC<McpConsoleModalProps> = ({
  isOpen,
  onClose,
  mcpStatus,
  tools,
  onExecuteTool,
}) => {
  if (!isOpen) return null;

  const [selectedTool, setSelectedTool] = useState<McpTool>(tools[0] || {
    name: 'secondbrain.query_graph',
    description: 'Queries the Secondbrain knowledge and architecture graph.',
    category: 'secondbrain',
    parameters: { type: 'object', properties: {} },
  });

  const [paramsInput, setParamsInput] = useState<string>(
    JSON.stringify(
      tools[0]?.parameters?.properties
        ? Object.fromEntries(
            Object.entries(tools[0].parameters.properties).map(([k, v]) => [k, v.default ?? ''])
          )
        : {},
      null,
      2
    )
  );

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const handleToolChange = (tool: McpTool) => {
    setSelectedTool(tool);
    const initialArgs = tool.parameters?.properties
      ? Object.fromEntries(
          Object.entries(tool.parameters.properties).map(([k, v]) => [k, v.default ?? ''])
        )
      : {};
    setParamsInput(JSON.stringify(initialArgs, null, 2));
    setExecutionOutput(null);
  };

  const handleRun = async () => {
    setIsExecuting(true);
    const startTime = Date.now();
    try {
      const parsedArgs = paramsInput.trim() ? JSON.parse(paramsInput) : {};
      const res = await onExecuteTool(selectedTool.name, parsedArgs);
      setExecutionOutput(res);
      setLatency(Date.now() - startTime);
    } catch (err: any) {
      setExecutionOutput({ error: err.message || 'Execution error' });
      setLatency(Date.now() - startTime);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Secondbrain MCP JSON-RPC Console</h2>
            <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              {mcpStatus?.connected ? 'Live (3001)' : 'Sandbox Mode'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool Selector List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Registered MCP Tools ({tools.length})
            </span>
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {tools.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleToolChange(t)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedTool.name === t.name
                      ? 'bg-slate-900 border-emerald-500/80 text-white shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold">{t.name}</div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tool Caller */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedTool.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">category: {selectedTool.category}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedTool.description}</p>
            </div>

            {/* Arguments Editor */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400 block">
                Parameters (JSON-RPC 2.0 params)
              </span>
              <textarea
                value={paramsInput}
                onChange={(e) => setParamsInput(e.target.value)}
                rows={5}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 rounded-md transition-colors"
            >
              {isExecuting ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  Invoking via MCP...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Execute MCP Tool
                </>
              )}
            </button>

            {/* Execution Result */}
            {executionOutput && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Execution Output:</span>
                  {latency !== null && (
                    <span className="text-emerald-400 tabular-nums">Latency: {latency}ms</span>
                  )}
                </div>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 overflow-x-auto max-h-56 leading-relaxed">
                  {JSON.stringify(executionOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
