import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { roomHandler } from './room';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bodyParser from 'body-parser';

// import { handler } from './storeUsers';

// Load environment variables from the .env file
dotenv.config();
// Set the port to either the value defined in the .env file or 8080 as a fallback
const port = process.env.PORT || 8080;
// Initialize the Express app
const app: Express = express();
// Use the CORS middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
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
  // Handle the room logic for this socket connection
  roomHandler(socket);

  // 'socket' object represents the event being emitted from the client or if this was the client listening then the 'socket' object would represent the event being emitted from the server.
  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });
});

// Add a GET endpoint for the root route of the Express app
app.get('/', (req: Request, res: Response) => {
  req;
  // Send a response indicating the server is listening on the specified port
  res.send(`Listening to the server on ${port}`);
});

app.get('/users', async (req: Request, res: Response) => {
  req;
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// app.post('/users', async (req: Request, res: Response) => {
//   const { name, email } = req.body;
//   const newUser = await prisma.user.create({
//     data: {
//       name,
//       email,
//     },
//   })
//   res.json(newUser);
//   console.log('created user: ', newUser)
// });


app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(newUser);
    console.log('Created user: ', newUser);
  } catch (error) {
    console.log(error);
  }
})

// Start the HTTP server and log that it is listening on the specified port
server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});
