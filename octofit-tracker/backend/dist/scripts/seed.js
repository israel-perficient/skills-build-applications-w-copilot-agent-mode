"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.LeaderboardEntry.deleteMany({}),
            models_1.Workout.deleteMany({})
        ]);
        const users = await models_1.User.insertMany([
            {
                name: 'Ava Thompson',
                email: 'ava.thompson@example.com',
                age: 29,
                fitnessLevel: 'advanced',
                city: 'Seattle',
                bio: 'Marathon runner focused on endurance and recovery.'
            },
            {
                name: 'Lucas Chen',
                email: 'lucas.chen@example.com',
                age: 34,
                fitnessLevel: 'intermediate',
                city: 'Austin',
                bio: 'Loves cycling and team challenges.'
            },
            {
                name: 'Maya Patel',
                email: 'maya.patel@example.com',
                age: 26,
                fitnessLevel: 'beginner',
                city: 'Denver',
                bio: 'Building consistency with strength and walking workouts.'
            },
            {
                name: 'Noah Garcia',
                email: 'noah.garcia@example.com',
                age: 31,
                fitnessLevel: 'advanced',
                city: 'Boston',
                bio: 'Strength coach and weekend hiker.'
            }
        ]);
        const teams = await models_1.Team.insertMany([
            {
                name: 'River Runners',
                sport: 'Running',
                city: 'Seattle',
                motto: 'Move together, finish stronger.',
                members: [users[0]._id, users[2]._id]
            },
            {
                name: 'Peak Cyclists',
                sport: 'Cycling',
                city: 'Austin',
                motto: 'Pedal hard, recover smarter.',
                members: [users[1]._id, users[3]._id]
            }
        ]);
        const userTeams = [
            { userId: users[0]._id, teamId: teams[0]._id },
            { userId: users[1]._id, teamId: teams[1]._id },
            { userId: users[2]._id, teamId: teams[0]._id },
            { userId: users[3]._id, teamId: teams[1]._id }
        ];
        const teamByUserId = new Map();
        userTeams.forEach(({ userId, teamId }) => {
            teamByUserId.set(String(userId), teamId);
        });
        await Promise.all(userTeams.map(({ userId, teamId }) => models_1.User.findByIdAndUpdate(userId, { teamId }, { new: true, runValidators: true })));
        const updatedUsers = await models_1.User.find().lean();
        const activities = await models_1.Activity.insertMany([
            {
                userId: updatedUsers[0]._id,
                teamId: teamByUserId.get(String(updatedUsers[0]._id)),
                type: 'run',
                durationMinutes: 42,
                caloriesBurned: 520,
                distanceKm: 7.8,
                date: new Date('2026-08-10T06:30:00Z'),
                notes: 'Tempo run with a steady pace through the park.'
            },
            {
                userId: updatedUsers[1]._id,
                teamId: teamByUserId.get(String(updatedUsers[1]._id)),
                type: 'cycle',
                durationMinutes: 48,
                caloriesBurned: 610,
                distanceKm: 18.5,
                date: new Date('2026-08-11T18:00:00Z'),
                notes: 'Hill repeats on the city loop.'
            },
            {
                userId: updatedUsers[2]._id,
                teamId: teamByUserId.get(String(updatedUsers[2]._id)),
                type: 'strength',
                durationMinutes: 35,
                caloriesBurned: 340,
                distanceKm: 0,
                date: new Date('2026-08-12T07:00:00Z'),
                notes: 'Full-body lift focused on lower body and core.'
            },
            {
                userId: updatedUsers[3]._id,
                teamId: teamByUserId.get(String(updatedUsers[3]._id)),
                type: 'hike',
                durationMinutes: 70,
                caloriesBurned: 480,
                distanceKm: 11.2,
                date: new Date('2026-08-13T09:15:00Z'),
                notes: 'Trail climb with a summit finish.'
            }
        ]);
        const workoutDocs = await models_1.Workout.insertMany([
            {
                name: '5K Tempo Builder',
                category: 'cardio',
                durationMinutes: 35,
                difficulty: 'intermediate',
                focusAreas: ['endurance', 'speed', 'form'],
                description: 'Alternating tempo intervals to improve pace control and stamina.'
            },
            {
                name: 'Leg Day Strength Circuit',
                category: 'strength',
                durationMinutes: 40,
                difficulty: 'advanced',
                focusAreas: ['glutes', 'quads', 'core'],
                description: 'Compound lifting set focused on power and stability.'
            },
            {
                name: 'Recovery Mobility Flow',
                category: 'mobility',
                durationMinutes: 20,
                difficulty: 'beginner',
                focusAreas: ['hips', 'shoulders', 'mobility'],
                description: 'Gentle stretching flow to improve range of motion.'
            }
        ]);
        await models_1.LeaderboardEntry.insertMany([
            {
                userId: updatedUsers[0]._id,
                teamId: teamByUserId.get(String(updatedUsers[0]._id)),
                score: 980,
                rank: 1,
                streak: 12,
                updatedAt: new Date()
            },
            {
                userId: updatedUsers[1]._id,
                teamId: teamByUserId.get(String(updatedUsers[1]._id)),
                score: 940,
                rank: 2,
                streak: 9,
                updatedAt: new Date()
            },
            {
                userId: updatedUsers[2]._id,
                teamId: teamByUserId.get(String(updatedUsers[2]._id)),
                score: 860,
                rank: 3,
                streak: 5,
                updatedAt: new Date()
            },
            {
                userId: updatedUsers[3]._id,
                teamId: teamByUserId.get(String(updatedUsers[3]._id)),
                score: 905,
                rank: 4,
                streak: 7,
                updatedAt: new Date()
            }
        ]);
        console.log('Seeded users:', users.length);
        console.log('Seeded teams:', teams.length);
        console.log('Seeded activities:', activities.length);
        console.log('Seeded workouts:', workoutDocs.length);
        console.log('Seeded leaderboard entries:', 4);
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
