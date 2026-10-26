import React, { useState } from 'react';
import { ExternalLink, Layers, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { AtlasSchema } from '../types/index.ts';

interface AtlasSchemasViewProps {
  schemas: AtlasSchema[];
}

export const AtlasSchemasView: React.FC<AtlasSchemasViewProps> = ({ schemas }) => {
  const [selectedSchema, setSelectedSchema] = useState<AtlasSchema>(schemas[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Atlas Base Foundation (Release v0.2.6)
            </h1>
            <a
              href="https://github.com/thebrotherscarr-bit/Atlas/releases/tag/v0.2.6"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:border-cyan-700 transition-colors whitespace-nowrap shrink-0"
            >
              v0.2.6 Release
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Atlas serves as the structural schema foundation that grounds Manjuel's recursive improvement loops.
            Every generated patch must satisfy these schema specifications and their invariant bounds.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schemas List */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Atlas v0.2.6 Contract Registry ({schemas.length})
          </span>
          {schemas.map((schema) => (
            <button
              key={schema.id}
              onClick={() => setSelectedSchema(schema)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedSchema.id === schema.id
                  ? 'bg-slate-900 border-cyan-500/80 text-white shadow-xs'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{schema.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                  v{schema.version}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">{schema.id}</div>
            </button>
          ))}
        </div>

        {/* Right Column: Schema Detailed Specification */}
        <div className="lg:col-span-2 rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">{selectedSchema.name}</h2>
              <span className="text-xs font-mono text-cyan-400">{selectedSchema.id}</span>
              <p className="text-xs text-slate-300 mt-2">{selectedSchema.description}</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 whitespace-nowrap shrink-0">
              Type: {selectedSchema.entityType}
            </span>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-3">Field Specifications & Type Invariants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Required</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {selectedSchema.fields.map((f) => (
                    <tr key={f.name} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-cyan-300">{f.name}</td>
                      <td className="py-2.5 px-3 text-purple-300">{f.type}</td>
                      <td className="py-2.5 px-3">
                        {f.required ? (
                          <span className="text-amber-400">Yes</span>
                        ) : (
                          <span className="text-slate-500">Optional</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">Downstream Manjuel Dependents</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSchema.dependents.map((dep) => (
                <span
                  key={dep}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
