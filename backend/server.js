import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import calculatorRoutes from './routes/calculatorRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fix-flip-portal')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calculators', calculatorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fix & Flip Loan Broker API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
