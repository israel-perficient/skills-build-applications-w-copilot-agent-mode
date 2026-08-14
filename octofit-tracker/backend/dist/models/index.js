"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = exports.LeaderboardEntry = exports.Activity = exports.Team = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, required: true, min: 16, max: 80 },
    fitnessLevel: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', default: null },
    city: { type: String, required: true, trim: true },
    bio: { type: String, default: '' }
}, { timestamps: true });
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, default: '' },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
const activitySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', default: null },
    type: { type: String, required: true, enum: ['run', 'cycle', 'strength', 'swim', 'hike'] },
    durationMinutes: { type: Number, required: true, min: 10 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: '' }
}, { timestamps: true });
const leaderboardEntrySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', default: null },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    streak: { type: Number, default: 0, min: 0 },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
const workoutSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['cardio', 'strength', 'mobility', 'recovery'] },
    durationMinutes: { type: Number, required: true, min: 15 },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    focusAreas: [{ type: String, trim: true }],
    description: { type: String, required: true }
}, { timestamps: true });
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.Team = mongoose_1.default.models.Team || mongoose_1.default.model('Team', teamSchema);
exports.Activity = mongoose_1.default.models.Activity || mongoose_1.default.model('Activity', activitySchema);
exports.LeaderboardEntry = mongoose_1.default.models.LeaderboardEntry || mongoose_1.default.model('LeaderboardEntry', leaderboardEntrySchema);
exports.Workout = mongoose_1.default.models.Workout || mongoose_1.default.model('Workout', workoutSchema);
