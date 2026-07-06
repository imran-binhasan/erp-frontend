import { useState, useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : undefined);

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      auth: (cb: (token: string) => void) => cb(localStorage.getItem('token') ?? ''),
      transports: ['websocket'],
    });
  }
  return socketInstance;
}

export function useSocket() {
  const [socket] = useState<Socket>(() => getSocket());

  useEffect(() => {
    return () => {
      // don't disconnect — singleton
    };
  }, []);

  return socket;
}
