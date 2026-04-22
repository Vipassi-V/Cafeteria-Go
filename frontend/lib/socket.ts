import { io, Socket } from 'socket.io-client';

const socketUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';

/**
 * Socket.IO Singleton Client
 * Hardened for Production with Timeouts and Error Handling.
 */
export const socket: Socket = io(socketUrl, {
  transports: ['websocket'],
  autoConnect: false,
  timeout: 10000, // 10 seconds timeout for handshake
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

// Hardening: Log Socket state for debugging
socket.on('connect_error', (err) => {
  console.error('Socket Connection Error:', err.message);
});

socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect to Kitchen Hub...');
});

export const connectSocket = (token: string) => {
  if (socket.connected) return;
  
  socket.auth = { token };
  
  try {
    socket.connect();
    console.log('Socket initialization started...');
  } catch (err) {
    console.error('Socket Connect Failed:', err);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected safely.');
  }
};
