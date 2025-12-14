import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import sweetRoutes from './routes/sweetRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CandyCraft API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;
