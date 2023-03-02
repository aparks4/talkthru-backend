import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

interface IUser {
  peerId: string;
  userName: string;
}

interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}

interface IRoomParams {
  roomId: string;
  peerId: string;
}

interface IJoinRoomParams extends IRoomParams {
  userName: string;
}

const rooms: Record<string, Record<string, IUser>> = {};
const chatLogs: Record<string, IMessage[]> = {};

export const roomHandler = (socket: Socket) => {
	// Function to create a new room
	const createRoom = () => {
		// Generate unique room ID using UUID v4
		const roomId = uuidV4();
		// Add room to the rooms object
		rooms[roomId] = {};
		// Emit the created room information to the client
		socket.emit('room-created', { roomId });
		console.log('user created the room', roomId);
	};

	// Function to join an existing room
	const joinRoom = ({ roomId, peerId, userName }: IJoinRoomParams) => {
		if (!rooms[roomId]) {
			// Create room if it doesn't exist already
			// Add user to room to wait
			rooms[roomId][peerId] = { peerId, userName };
		} else {
			// Room exists with a matching peer
			// Add user to room to wait
			rooms[roomId][peerId] = { peerId, userName };

			// Create chat log for room if it doesn't exist already
			if (!chatLogs[roomId]) {
				chatLogs[roomId] = [];
			}

			// Sends old messages from chat log for 'roomId' to new peers who join the room
			socket.emit('get-messages', chatLogs[roomId]);

			console.log('user joined the room', roomId, peerId);
			// Add peer to the room's list of participants
			// rooms[roomId][peerId] = { peerId, userName };
			// Join the room
			socket.join(roomId);
			// Emit event to other participants that a user has joined
			socket.to(roomId).emit('user-joined', { peerId, userName });
			// Emit event to get list of all participants
			socket.emit('get-users', {
				roomId,
				participants: rooms[roomId],
			});

			// Emit event to navigate users to the room
			socket.to(roomId).emit('room-ready', { participants: rooms[roomId] });

			// On socket disconnect, leave the room
			socket.on('disconnect', () => {
				console.log('user left the room', peerId);
				leaveRoom({ roomId, peerId });
			});
		}
	};

	// Function to leave a room
	const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
		// Check if the room exists
		if (rooms[roomId]) {
			// Remove the peer from the room's list of participants
			// rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
			// Emit event to other participants that a user has disconnected
			socket.to(roomId).emit('user-disconnected', peerId);
		}
	};

	// Function to notify all peers of the peer that is sharing their screen
	const startSharing = ({ peerId, roomId }: IRoomParams) => {
		socket.to(roomId).emit('user-started-sharing', peerId);
	};

	// Function to notify all peers that a peer has stopped sharing their screen
	const stopSharing = (roomId: string) => {
		socket.to(roomId).emit('user-stopped-sharing');
	};

	// Function to handle sharing messages between peers
	const addMessage = (roomId: string, message: IMessage) => {
		// Create chat log for 'roomId' if it doesn't exist already
		if (!chatLogs[roomId]) {
			chatLogs[roomId] = [];
		}

		// Add message to the chat log for 'roomId'
		chatLogs[roomId].push(message);

		// Emit the message for all peers in 'roomId'
		socket.to(roomId).emit('add-message', message);
	};

	// Listen for create-room event
	socket.on('create-room', createRoom);
	// Listen for join-room event
	socket.on('join-room', joinRoom);
	// Listen for start/stop sharing events
	socket.on('start-sharing', startSharing);
	socket.on('stop-sharing', stopSharing);
	// Listen for a chat message
	socket.on('send-message', addMessage);
};