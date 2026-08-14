"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
const PORT = 8000;
app.use(express_1.default.json());
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.get('/', (_req, res) => {
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
const createRouter = (resource) => {
    const router = express_1.default.Router();
    const modelMap = {
        users: models_1.User,
        teams: models_1.Team,
        activities: models_1.Activity,
        leaderboard: models_1.LeaderboardEntry,
        workouts: models_1.Workout
    };
    router.get('/', async (_req, res) => {
        try {
            const items = await modelMap[resource].find({}).lean();
            res.json({
                resource,
                message: `List all ${resource}`,
                count: items.length,
                data: items,
                baseUrl: `${baseUrl}/api/${resource}/`
            });
        }
        catch (error) {
            res.status(500).json({ resource, error: 'Failed to fetch records' });
        }
    });
    router.get('/:id', async (req, res) => {
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
        }
        catch (error) {
            return res.status(500).json({ resource, error: 'Failed to fetch record' });
        }
    });
    router.post('/', async (req, res) => {
        try {
            const created = await modelMap[resource].create(req.body);
            res.status(201).json({
                resource,
                message: `Create ${resource}`,
                data: created
            });
        }
        catch (error) {
            res.status(400).json({ resource, error: 'Failed to create record' });
        }
    });
    router.put('/:id', async (req, res) => {
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
        }
        catch (error) {
            return res.status(400).json({ resource, error: 'Failed to update record' });
        }
    });
    router.delete('/:id', async (req, res) => {
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
        }
        catch (error) {
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
    await (0, database_1.connectToDatabase)();
});
exports.default = app;
