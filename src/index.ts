import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';

dotenv.config();
const port = process.env.PORT || 8080;
const app: Express = express();
app.use(cors);
const server = http.createServer(app);
// Initializes a new instance of the 'socket.io' server and attaches the 'http' server instance. Allows 'socket.io' server to listen for websocket connections on the same port as the 'http' server, which is defined by the port constant. The 2nd argument is an options object that you can specify various configurations, more info here 'https://socket.io/docs/v4/server-options/'.
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Sets up an event handler for the 'connection' event in the 'socket.io' server. The 1st argument is an event you create. The 2nd argument is a callback function that gets invoked whenever the specified event, 'connection', gets met from another place that emitted the 'connection' event. Events emitted by either client or server can be received by client or server, as long as the receiving end has a matching event string.
io.on('connection', (socket) => {
  console.log('user is connected');

  roomHandler(socket);

  // 'socket' object represents the event being emitted from the client or if this was the client listening then the 'socket' object would represent the event being emitted from the server.
  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });
});

app.get('/', (req: Request, res: Response) => {
  req;
  res.send(`Listening to the server on ${port}`);
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});
