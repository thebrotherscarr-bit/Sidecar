import { IncomingMessage, ServerResponse } from 'http';
import { mcpProxy } from './mcpClient.ts';
import { githubService } from './githubClient.ts';
import { ollamaService } from './ollamaClient.ts';
import { executeRecursivePass } from './geminiLoop.ts';
import { INITIAL_REPOS, INITIAL_SCRATCHPAD } from '../data/mockEcosystem.ts';

let liveScratchpad = { ...INITIAL_SCRATCHPAD };

// Helper to parse JSON body from incoming Node.js request
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<boolean> {
  const url = req.url || '';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return true;
  }

  // Get current scratchpad & cached notes
  if (url === '/api/scratchpad/current' && req.method === 'GET') {
    sendJson(res, 200, liveScratchpad);
    return true;
  }

  // Update scratchpad content (manual user edits or loop sync)
  if (url === '/api/scratchpad/update' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    if (body.content !== undefined) {
      liveScratchpad.content = body.content;
      liveScratchpad.updatedAt = new Date().toISOString();
    }
    sendJson(res, 200, { success: true, scratchpad: liveScratchpad });
    return true;
  }

  // Execute recursive loop step (N -> N+1)
  if (url === '/api/loop/step' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const passNumber = body.passNumber || 1;
    const directive = body.directive || 'Recursive architectural refinement through Atlas v0.2.6';
    const engine = body.engine || 'ollama';
    const model = body.model || 'qwen2.5-coder:7b';

    if (engine === 'ollama') {
      // Local Ollama generation referencing scratchpad
      const prompt = `You are Manjuel Recursive Self-Improvement Engine. Current pass N=${passNumber}.
Atlas Base Release: v0.2.6.
Secondbrain Working Scratchpad:
${liveScratchpad.content}

Objective: ${directive}
Analyze and refine the code and schema contracts. Record your pass ${passNumber} reflections.`;

      await ollamaService.generateWithOllama(prompt, model, body.endpointUrl);
    }

    const { pass, updatedScratchpadContent } = await executeRecursivePass({
      directive,
      passNumber,
      currentScratchpad: liveScratchpad,
      previousPatches: body.previousPatches,
    });

    liveScratchpad.content = updatedScratchpadContent;
    liveScratchpad.activePass = passNumber;
    liveScratchpad.updatedAt = new Date().toISOString();

    sendJson(res, 200, {
      pass,
      updatedScratchpad: liveScratchpad,
    });
    return true;
  }

  // Ollama Status & Pulled Models
  if (url === '/api/ollama/status' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const endpoint = body.endpointUrl || 'http://localhost:11434';
    const status = await ollamaService.checkStatus(endpoint);
    sendJson(res, 200, status);
    return true;
  }

  // Ollama Model Inference Test
  if (url === '/api/ollama/generate' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const result = await ollamaService.generateWithOllama(
      body.prompt,
      body.model,
      body.endpointUrl
    );
    sendJson(res, 200, result);
    return true;
  }

  // MCP Health
  if (url === '/api/mcp/health' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const endpoint = body.endpointUrl || 'http://localhost:3001';
    const status = await mcpProxy.checkHealth(endpoint, body.authToken);
    sendJson(res, 200, status);
    return true;
  }

  // MCP JSON-RPC Proxy
  if (url === '/api/mcp/rpc' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const endpoint = body.endpointUrl || 'http://localhost:3001';
    const request = body.request || body;
    const result = await mcpProxy.executeRpc(endpoint, request, body.authToken);
    sendJson(res, 200, result);
    return true;
  }

  // GitHub Repositories
  if (url === '/api/github/repos' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const repos = await Promise.all(
      INITIAL_REPOS.map((r) => githubService.getRepoStatus(r.name, token))
    );
    sendJson(res, 200, repos);
    return true;
  }

  // Loop Apply
  if (url === '/api/loop/apply' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const { method, repo, rawDiff, title } = body;

    if (method === 'github_pr') {
      const prResult = await githubService.createPullRequest({
        repo: repo || 'Atlas',
        title: `chore(manjuel-loop): ${title || 'Autonomous recursive improvement'}`,
        branchName: `manjuel-loop/pass-${Date.now().toString(36)}`,
        body: `Applied via Manjuel Loop Runner through Atlas v0.2.6.\n\nEvaluated against 22 Jesster invariants.`,
      });
      sendJson(res, 200, {
        success: true,
        method: 'github_pr',
        message: 'Created Pull Request on GitHub.',
        prUrl: prResult.prUrl,
      });
      return true;
    }

    // Apply via MCP
    const mcpRes = await mcpProxy.executeRpc(body.endpointUrl || 'http://localhost:3001', {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'fs.apply_patch',
        arguments: {
          patchContent: rawDiff || '',
        },
      },
    });

    sendJson(res, 200, {
      success: true,
      method: 'mcp_local',
      message: 'Applied converged patch to local Secondbrain workspace via MCP.',
      mcpResponse: mcpRes,
    });
    return true;
  }

  // Health
  if (url === '/api/health') {
    sendJson(res, 200, {
      status: 'nominal',
      service: 'manjuel-loop-runner',
      baseAtlasVersion: 'v0.2.6',
    });
    return true;
  }

  if (next) {
    next();
  }
  return false;
}
