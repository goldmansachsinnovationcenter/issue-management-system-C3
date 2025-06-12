import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import issueRoutes from './routes/issueRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/issues', issueRoutes);
app.use('/api/statistics', statisticsRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Issue Management API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
});

export default app;
