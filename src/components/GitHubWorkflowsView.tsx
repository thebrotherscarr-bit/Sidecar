import React, { useState } from 'react';
import { GitBranch, GitPullRequest, ExternalLink, Play, CheckCircle2, Clock, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';
import { GitHubWorkflowRun, RepoMetadata } from '../types';

interface GitHubWorkflowsViewProps {
  repos: RepoMetadata[];
  workflows: GitHubWorkflowRun[];
  onTriggerWorkflow: (repo: string, name: string) => Promise<void>;
  onRefreshWorkflows: () => Promise<void>;
  isTriggering: boolean;
}

export const GitHubWorkflowsView: React.FC<GitHubWorkflowsViewProps> = ({
  repos,
  workflows,
  onTriggerWorkflow,
  onRefreshWorkflows,
  isTriggering,
}) => {
  const [selectedRepo, setSelectedRepo] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredWorkflows = workflows.filter((w) => {
    if (selectedRepo === 'all') return true;
    return w.repo.toLowerCase().includes(selectedRepo.toLowerCase());
  });

  const handleTrigger = async (repo: string, name: string) => {
    setFeedback(`Dispatching workflow '${name}' on ${repo}...`);
    await onTriggerWorkflow(repo, name);
    setFeedback(`Workflow run dispatched successfully to GitHub Actions.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">
            GitHub Workflows & Multi-Repo CI
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time synchronization with <code>thebrotherscarr-bit</code> repositories:
            Atlas (v0.2.6), Jesster (secondbrain-b39), and Manjuel. Track CI integrity pipelines and dispatch remote validation runs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefreshWorkflows}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Remote
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded bg-slate-950 border border-cyan-800/80 text-cyan-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Repositories Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {repos.map((r) => (
          <div key={r.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{r.name}</span>
              <a
                href={r.releaseUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
              >
                {r.currentRelease}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <p className="text-xs text-slate-400 leading-snug line-clamp-2">{r.description}</p>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>branch: {r.defaultBranch}</span>
              <button
                onClick={() => handleTrigger(r.fullName, 'Integrity CI')}
                disabled={isTriggering}
                className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white"
              >
                <Play className="w-3 h-3 fill-current" />
                Dispatch CI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workflows List Table */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Recent Workflow Executions</h2>
            <span className="text-xs text-slate-500 font-mono">({filteredWorkflows.length})</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedRepo('all')}
              className={`px-2.5 py-1 rounded ${selectedRepo === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRepo('Atlas')}
              className={`px-2.5 py-1 rounded ${selectedRepo === 'Atlas' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Atlas
            </button>
            <button
              onClick={() => setSelectedRepo('Jesster')}
              className={`px-2.5 py-1 rounded ${selectedRepo === 'Jesster' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Jesster
            </button>
            <button
              onClick={() => setSelectedRepo('Manjuel')}
              className={`px-2.5 py-1 rounded ${selectedRepo === 'Manjuel' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Manjuel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Workflow Name</th>
                <th className="py-2.5 px-4">Repository</th>
                <th className="py-2.5 px-4">Branch / Commit</th>
                <th className="py-2.5 px-4 text-right">Duration</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filteredWorkflows.map((run) => (
                <tr key={run.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-medium text-xs">
                    {run.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {run.repo.replace('thebrotherscarr-bit/', '')}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="text-cyan-300">{run.branch}</span> · {run.commitHash}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                    {run.durationSec}s
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={run.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      <span>Logs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
