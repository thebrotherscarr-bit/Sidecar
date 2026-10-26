import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './src/server/apiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to delegate /api to API router
app.use(async (req, res, next) => {
  if (req.url.startsWith('/api')) {
    const handled = await handleApiRequest(req, res, next);
    if (!handled && !res.headersSent) {
      next();
    }
  } else {
    next();
  }
});

// Serve static frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Secondbrain Sidecar running on port ${port}`);
});
