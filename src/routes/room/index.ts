import { Socket } from 'socket.io';

interface IPeer {
	peerId: string;
	peerName: string;
}

interface IRoomParams {
	roomId: string;
	peerId: string;
}

interface IJoinRoomParams extends IRoomParams {
	peerName: string;
}

interface IChatPost {
	content: string;
	authorId: string;
	timestamp: number;
}

const rooms: Record<string, Record<string, IPeer>> = {};
const messages: Record<string, IChatPost[]> = {};
const notes: Record<string, IChatPost[]> = {};

export const roomHandler = (socket: Socket) => {
	// Function to create a new room
	const createRoom = ({ roomId }: { roomId: string }) => {
		// Create the room if it doesn't exist
		if (!rooms[roomId]) {
			rooms[roomId] = {};
		}

		// Emit the created room information to the client
		socket.emit('room-created', { roomId });
	};

	// Function to join an existing room
	const joinRoom = ({ roomId, peerId, peerName }: IJoinRoomParams) => {
		// Create the room if it doesn't exist
		if (!rooms[roomId]) {
			rooms[roomId] = {};
		}

		// Add user to room
		rooms[roomId][peerId] = { peerId, peerName };

		// Create messages for room if it doesn't exist
		if (!messages[roomId]) {
			messages[roomId] = [];
		}

		// Create notes for user if it doesn't exist
		if (!notes[peerId]) {
			notes[peerId] = [];
		}

		// Sends chat history for room and peer to new peers who join the room
		socket.emit('get-history', { messagesHistory: messages[roomId], notesHistory: notes[peerId] });

		// Join the room
		socket.join(roomId);
		// Emit event to other existing users that a user has joined
		socket.to(roomId).emit('user-joined', { peerId, peerName });
		// Emit event to get list of all participants
		socket.emit('get-users', {
			roomId,
			participants: rooms[roomId],
		});

		// Listener to remove user from records
		socket.on('disconnect', () => {
			leaveRoom({ roomId, peerId });
		});
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
	const addMessage = (roomId: string, message: IChatPost) => {
		// Create messages for room if it doesn't exist
		if (!messages[roomId]) {
			messages[roomId] = [];
		}

		// Store new message in room's messages
		messages[roomId].push(message);

		// Emit the message for all peers in 'roomId'
		socket.to(roomId).emit('add-message', message);
	};

	// Function to keep track of a user's notes
	const addNote = (peerId: string, note: IChatPost) => {
		// Create new notes for user if it doesn't exist already
		if (!notes[peerId]) {
			notes[peerId] = [];
		}

		// Store new note in user's notes
		notes[peerId].push(note);
	};

	// Register listeners for signals/emits from client
	socket.on('create-room', createRoom);
	socket.on('join-room', joinRoom);
	socket.on('start-sharing', startSharing);
	socket.on('stop-sharing', stopSharing);
	socket.on('send-message', addMessage);
	socket.on('send-note', addNote);
};
