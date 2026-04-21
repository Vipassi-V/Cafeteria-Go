import { io } from 'socket.io-client';

const socketUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';

/**
 * Socket.IO Singleton Client
 * Configured with 'websocket' transport for mobile stability.
 */
export const socket = io(socketUrl, {
  transports: ['websocket'],
  autoConnect: false, // We will connect manually once we have a token
});

export const connectSocket = (token: string) => {
  if (socket.connected) return;
  
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
