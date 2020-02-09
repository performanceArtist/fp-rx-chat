import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { useAuth, checkAuth } from './middleware/auth';
import { userInit } from './routes/user';

const app = express();
const server = http.createServer(app);

app.use(cors({ credentials: true, origin: 'http://front.dev.com:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));
useAuth(app);

app.use(checkAuth);

app.get('/test', (req, res) => {
  res.json({ test: 'OOP' });
});

app.get('/user', userInit(server));

server.listen(5000, () => {
  console.log('Listening on port 5000');
});
