import React, { useState } from 'react';
import { FileText, Save, Check, RefreshCw, Bookmark, Sparkles, Tag } from 'lucide-react';
import { ScratchpadNote, CachedContextNote } from '../types/index.ts';

interface ScratchpadViewProps {
  scratchpad: ScratchpadNote;
  onUpdateScratchpad: (newContent: string) => Promise<void>;
  isSteppingLoop: boolean;
}

export const ScratchpadView: React.FC<ScratchpadViewProps> = ({
  scratchpad,
  onUpdateScratchpad,
  isSteppingLoop,
}) => {
  const [content, setContent] = useState(scratchpad.content);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedNote, setSelectedNote] = useState<CachedContextNote | null>(
    scratchpad.cachedNotes[0] || null
  );

  const handleSave = async () => {
    await onUpdateScratchpad(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Sync if parent updates scratchpad
  React.useEffect(() => {
    setContent(scratchpad.content);
  }, [scratchpad.content]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Secondbrain Notes: Contextual Cache & Scratchpad
            </h1>
            {isSteppingLoop && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono rounded bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Manjuel Writing to Scratchpad...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Secondbrain serves markdown notes as memory context for Manjuel's recursive loops.
            Hypotheses, invariant assertion results, and refined diff proposals are actively recorded here across iterations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {isSaved ? 'Synced to Secondbrain' : 'Save Scratchpad'}
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contextual Cache Notes from Secondbrain */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Secondbrain Context Cache ({scratchpad.cachedNotes.length})
            </span>
            <span className="text-[11px] font-mono text-slate-500">Auto-Indexed Vault</span>
          </div>

          <div className="space-y-2">
            {scratchpad.cachedNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedNote?.id === note.id
                    ? 'bg-slate-900 border-amber-500/80 text-white shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{note.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 truncate">
                  {note.vaultPath}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Note Context Details */}
          {selectedNote && (
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2">
              <span className="text-xs font-semibold text-white block">{selectedNote.title}</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedNote.excerpt}
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                vault: {selectedNote.vaultPath}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (2 cols): Active Working Scratchpad */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">{scratchpad.title}</span>
              <span className="text-[11px] font-mono text-slate-500">
                (Pass N={scratchpad.activePass})
              </span>
            </div>

            <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'editor' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Markdown Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'preview' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Formatted Preview
              </button>
            </div>
          </div>

          {activeTab === 'editor' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={22}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
              placeholder="Live scratchpad markdown..."
            />
          ) : (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-sans leading-relaxed min-h-[440px] max-h-[600px] overflow-y-auto whitespace-pre-wrap">
              {content}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
            <span>Path: {scratchpad.vaultPath}</span>
            <span>Last sync: {new Date(scratchpad.updatedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
