import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

const rooms: Record<string, string[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {
  // Function to create a new room
  const createRoom = () => {
    // Generate unique room ID using UUID v4
    const roomId = uuidV4();
    // Add room to the rooms object
    rooms[roomId] = [];
    // Emit the created room information to the client
    socket.emit('room-created', { roomId });
    console.log('user created the room', roomId);
  };

  // Function to join an existing room
  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    // Check if the room exists
    if (rooms[roomId]) {
      console.log('user joined the room', roomId, peerId);
      // Add peer to the room's list of participants
      rooms[roomId].push(peerId);
      // Join the room
      socket.join(roomId);
      // Emit event to other participants that a user has joined
      socket.to(roomId).emit('user-joined', { peerId });
      // Emit event to get list of all participants
      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      });
    }

    // On socket disconnect, leave the room
    socket.on('disconnect', () => {
      console.log('user left the room', peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  // Function to leave a room
  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    // Check if the room exists
    if (rooms[roomId]) {
      // Remove the peer from the room's list of participants
      rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
      // Emit event to other participants that a user has disconnected
      socket.to(roomId).emit('user-disconnected', peerId);
    }
  };

  // Listen for create-room event
  socket.on('create-room', createRoom);
  // Listen for join-room event
  socket.on('join-room', joinRoom);
};
