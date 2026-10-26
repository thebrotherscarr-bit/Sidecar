import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { FilePatch } from '../types';

interface DiffViewerProps {
  patch: FilePatch;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ patch }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'unified' | 'raw'>('unified');

  const handleCopy = () => {
    navigator.clipboard.writeText(patch.rawDiff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
      {/* File Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-white font-medium">{patch.filePath}</span>
          <span className="text-[11px] text-slate-500 font-sans">({patch.summary})</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2 py-0.5 text-[11px] rounded ${
                viewMode === 'unified' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2 py-0.5 text-[11px] rounded ${
                viewMode === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Diff
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Diff'}
          </button>
        </div>
      </div>

      {/* Diff Content */}
      {viewMode === 'raw' ? (
        <pre className="p-4 text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
          {patch.rawDiff}
        </pre>
      ) : (
        <div className="divide-y divide-slate-900">
          {patch.hunks.map((hunk, hIdx) => (
            <div key={hIdx}>
              {/* Hunk Header */}
              <div className="px-4 py-1 bg-slate-900/60 text-cyan-400/90 text-[11px] border-y border-slate-800/80">
                @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
              </div>

              {/* Lines */}
              <div className="py-1">
                {hunk.lines.map((line, lIdx) => {
                  const isAddition = line.type === 'addition';
                  const isDeletion = line.type === 'deletion';

                  return (
                    <div
                      key={lIdx}
                      className={`flex items-start px-2 py-0.5 leading-tight ${
                        isAddition
                          ? 'bg-emerald-950/40 text-emerald-300'
                          : isDeletion
                          ? 'bg-rose-950/40 text-rose-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {/* Old Line Number */}
                      <span className="w-10 text-right pr-3 select-none text-slate-600 tabular-nums">
                        {line.oldLineNumber || ''}
                      </span>
                      {/* New Line Number */}
                      <span className="w-10 text-right pr-3 select-none text-slate-600 tabular-nums">
                        {line.newLineNumber || ''}
                      </span>
                      {/* Sign */}
                      <span className="w-4 select-none font-bold">
                        {isAddition ? '+' : isDeletion ? '-' : ' '}
                      </span>
                      {/* Code */}
                      <span className="whitespace-pre overflow-x-auto font-mono flex-1">
                        {line.content}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
