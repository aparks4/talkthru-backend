import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();
const port = process.env.PORT || 8080;
const app: Express = express();
const server = http.createServer(app);

app.get('/', (req: Request, res: Response) => {
  res.send(`Listening to the server on ${port}`);
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});
