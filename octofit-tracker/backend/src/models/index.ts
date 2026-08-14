import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  teamId?: Types.ObjectId;
  city: string;
  bio: string;
}

export interface ITeam extends Document {
  name: string;
  sport: string;
  city: string;
  motto: string;
  members: Types.ObjectId[];
}

export interface IActivity extends Document {
  userId: Types.ObjectId;
  teamId?: Types.ObjectId;
  type: 'run' | 'cycle' | 'strength' | 'swim' | 'hike';
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm: number;
  date: Date;
  notes: string;
}

export interface ILeaderboardEntry extends Document {
  userId: Types.ObjectId;
  teamId?: Types.ObjectId;
  score: number;
  rank: number;
  streak: number;
  updatedAt: Date;
}

export interface IWorkout extends Document {
  name: string;
  category: 'cardio' | 'strength' | 'mobility' | 'recovery';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  description: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, required: true, min: 16, max: 80 },
    fitnessLevel: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    city: { type: String, required: true, trim: true },
    bio: { type: String, default: '' }
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    type: { type: String, required: true, enum: ['run', 'cycle', 'strength', 'swim', 'hike'] },
    durationMinutes: { type: Number, required: true, min: 10 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    streak: { type: Number, default: 0, min: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['cardio', 'strength', 'mobility', 'recovery'] },
    durationMinutes: { type: Number, required: true, min: 15 },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    focusAreas: [{ type: String, trim: true }],
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry =
  mongoose.models.LeaderboardEntry || mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
