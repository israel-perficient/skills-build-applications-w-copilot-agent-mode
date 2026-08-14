"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
    router.get('/', (_req, res) => {
        res.json({
            resource,
            message: `List all ${resource}`,
            baseUrl: `${baseUrl}/api/${resource}/`
        });
    });
    router.get('/:id', (req, res) => {
        res.json({
            resource,
            id: req.params.id,
            message: `Get ${resource} by id`,
            baseUrl: `${baseUrl}/api/${resource}/${req.params.id}`
        });
    });
    router.post('/', (req, res) => {
        res.status(201).json({
            resource,
            message: `Create ${resource}`,
            payload: req.body
        });
    });
    router.put('/:id', (req, res) => {
        res.json({
            resource,
            id: req.params.id,
            message: `Update ${resource}`,
            payload: req.body
        });
    });
    router.delete('/:id', (req, res) => {
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
    await (0, database_1.connectToDatabase)();
});
exports.default = app;
