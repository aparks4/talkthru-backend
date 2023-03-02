import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { roomHandler } from './routes/room';
import { usersRouter } from './routes/users';
import { loginRouter } from './routes/login';
import { verifyRouter } from './routes/verify';
import { userRouter } from './routes/user';
import { profilesRouter } from './profiles';
import { chooseSubjectRouter } from './routes/matching/choose-subject';
import { chooseExpertiseRouter } from './routes/matching/choose-expertise';
import { updateRoomIdRouter } from './routes/matching/update-roomid';
import { matchUserRouter } from './routes/matching/match-user';
import { profileRouter } from './routes/profile';

// Load environment variables from the .env file
dotenv.config();
// Set the port to either the value defined in the .env file or 8080 as a fallback
const port = process.env.PORT || 8080;
// Initialize the Express app
const app: Express = express();
// Middleware for parsing request bodies in x-www-form-urlencoded format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

// Routers
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/verify', verifyRouter);
app.use('/profile', profileRouter);
app.use('/profiles', profilesRouter);
app.use('/matching/choose-subject', chooseSubjectRouter);
app.use('/matching/choose-expertise', chooseExpertiseRouter);
app.use('/matching/update-roomid', updateRoomIdRouter);
app.use('/matching/match-user', matchUserRouter);

// Start the HTTP server and log that it is listening on the specified port
server.listen(process.env.PORT || 8080, () => {
  console.log(`Listening to the server on ${port}`);
});
