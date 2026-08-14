"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function connectToDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        return mongoose_1.default.connection;
    }
    catch (error) {
        console.warn('MongoDB connection unavailable. Continuing without the database connection.', error);
        return mongoose_1.default.connection;
    }
}
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
exports.default = mongoose_1.default.connection;
