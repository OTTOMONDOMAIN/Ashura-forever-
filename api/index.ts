import express from 'express';
import cookieParser from 'cookie-parser';
import apiRouter from '../src/server/api';

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

app.use('/api', apiRouter);

export default app;
