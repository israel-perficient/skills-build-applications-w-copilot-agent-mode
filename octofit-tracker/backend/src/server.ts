import express, { Request, Response } from 'express';
import { connectToDatabase } from './config/database';

const app = express();
const PORT = 8000;

app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Octofit Tracker API is running',
    baseUrl,
    routes: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/'
    ]
  });
});

const createRouter = (resource: string) => {
  const router = express.Router();

  router.get('/', (_req: Request, res: Response) => {
    res.json({
      resource,
      message: `List all ${resource}`,
      baseUrl: `${baseUrl}/api/${resource}/`
    });
  });

  router.get('/:id', (req: Request, res: Response) => {
    res.json({
      resource,
      id: req.params.id,
      message: `Get ${resource} by id`,
      baseUrl: `${baseUrl}/api/${resource}/${req.params.id}`
    });
  });

  router.post('/', (req: Request, res: Response) => {
    res.status(201).json({
      resource,
      message: `Create ${resource}`,
      payload: req.body
    });
  });

  router.put('/:id', (req: Request, res: Response) => {
    res.json({
      resource,
      id: req.params.id,
      message: `Update ${resource}`,
      payload: req.body
    });
  });

  router.delete('/:id', (req: Request, res: Response) => {
    res.json({
      resource,
      id: req.params.id,
      message: `Delete ${resource}`
    });
  });

  return router;
};

app.use('/api/users', createRouter('users'));
app.use('/api/teams', createRouter('teams'));
app.use('/api/activities', createRouter('activities'));
app.use('/api/leaderboard', createRouter('leaderboard'));
app.use('/api/workouts', createRouter('workouts'));

app.listen(PORT, async () => {
  console.log(`Octofit Tracker API listening on http://localhost:${PORT}`);
  console.log(`Codespaces base URL: ${baseUrl}`);

  await connectToDatabase();
});

export default app;
