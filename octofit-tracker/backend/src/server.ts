import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';
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

  const modelMap: Record<string, mongoose.Model<any>> = {
    users: User,
    teams: Team,
    activities: Activity,
    leaderboard: LeaderboardEntry,
    workouts: Workout
  };

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const items = await modelMap[resource].find({}).lean();
      res.json({
        resource,
        message: `List all ${resource}`,
        count: items.length,
        data: items,
        baseUrl: `${baseUrl}/api/${resource}/`
      });
    } catch (error) {
      res.status(500).json({ resource, error: 'Failed to fetch records' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const item = await modelMap[resource].findById(req.params.id).lean();
      if (!item) {
        return res.status(404).json({ resource, message: `${resource.slice(0, -1)} not found` });
      }
      return res.json({
        resource,
        id: req.params.id,
        message: `Get ${resource} by id`,
        data: item,
        baseUrl: `${baseUrl}/api/${resource}/${req.params.id}`
      });
    } catch (error) {
      return res.status(500).json({ resource, error: 'Failed to fetch record' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const created = await modelMap[resource].create(req.body);
      res.status(201).json({
        resource,
        message: `Create ${resource}`,
        data: created
      });
    } catch (error) {
      res.status(400).json({ resource, error: 'Failed to create record' });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const updated = await modelMap[resource].findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ resource, message: `${resource.slice(0, -1)} not found` });
      }
      return res.json({
        resource,
        id: req.params.id,
        message: `Update ${resource}`,
        data: updated
      });
    } catch (error) {
      return res.status(400).json({ resource, error: 'Failed to update record' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await modelMap[resource].findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ resource, message: `${resource.slice(0, -1)} not found` });
      }
      return res.json({
        resource,
        id: req.params.id,
        message: `Delete ${resource}`
      });
    } catch (error) {
      return res.status(500).json({ resource, error: 'Failed to delete record' });
    }
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
