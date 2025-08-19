'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Dynamic import for socket.io-client to avoid SSR issues
let io: any;
let Socket: any;

if (typeof window !== 'undefined') {
  import('socket.io-client').then((module) => {
    io = module.io;
    Socket = module.Socket;
  });
}

interface User {
  id: string;
  name: string;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

interface WatchRoom {
  id: string;
  name: string;
  movieId?: string;
  tvShowId?: string;
  animeId?: string;
  episodeId?: string;
  currentTime: number;
  isPlaying: boolean;
  host: string;
  users: { [socketId: string]: User };
  messages: ChatMessage[];
}

interface UseWatchTogetherProps {
  contentId: string;
  contentType: 'movie' | 'tv' | 'anime';
  userName?: string;
}

export function useWatchTogether({ contentId, contentType, userName = 'Anonymous' }: UseWatchTogetherProps) {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<WatchRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [syncState, setSyncState] = useState({ currentTime: 0, isPlaying: false });
  const [socketLoaded, setSocketLoaded] = useState(false);
  
  const videoCallbacks = useRef<{
    onPlay?: (time: number) => void;
    onPause?: (time: number) => void;
    onSeek?: (time: number) => void;
  }>({});

  // Initialize socket connection
  useEffect(() => {
    if (typeof window !== 'undefined' && !socketLoaded) {
      import('socket.io-client').then((module) => {
        const { io } = module;
        const socketInstance = io();
        setSocketLoaded(true);

        socketInstance.on('connect', () => {
          console.log('Connected to socket server');
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from socket server');
          setIsConnected(false);
          setIsInRoom(false);
          setRoom(null);
        });

        // Room events
        socketInstance.on('room-joined', ({ room: joinedRoom, isHost: hostStatus }) => {
          setRoom(joinedRoom);
          setIsHost(hostStatus);
          setIsInRoom(true);
          setMessages(joinedRoom.messages || []);
          setUsers(Object.values(joinedRoom.users));
        });

        socketInstance.on('user-joined', ({ user, userCount }) => {
          setUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
        });

        socketInstance.on('user-left', ({ userId, userCount }) => {
          setUsers(prev => prev.filter(u => u.id !== userId));
        });

        socketInstance.on('new-host', ({ newHostId, newHostName }) => {
          setUsers(prev => prev.map(u => ({ ...u, isHost: u.id === newHostId })));
          setIsHost(socketInstance.id === newHostId);
        });

        // Video sync events
        socketInstance.on('sync-state', ({ currentTime, isPlaying }) => {
          setSyncState({ currentTime, isPlaying });
          if (isPlaying && videoCallbacks.current.onPlay) {
            videoCallbacks.current.onPlay(currentTime);
          } else if (!isPlaying && videoCallbacks.current.onPause) {
            videoCallbacks.current.onPause(currentTime);
          }
        });

        socketInstance.on('video-play', ({ currentTime }) => {
          setSyncState(prev => ({ ...prev, isPlaying: true, currentTime }));
          if (videoCallbacks.current.onPlay) {
            videoCallbacks.current.onPlay(currentTime);
          }
        });

        socketInstance.on('video-pause', ({ currentTime }) => {
          setSyncState(prev => ({ ...prev, isPlaying: false, currentTime }));
          if (videoCallbacks.current.onPause) {
            videoCallbacks.current.onPause(currentTime);
          }
        });

        socketInstance.on('video-seek', ({ currentTime }) => {
          setSyncState(prev => ({ ...prev, currentTime }));
          if (videoCallbacks.current.onSeek) {
            videoCallbacks.current.onSeek(currentTime);
          }
        });

        // Chat events
        socketInstance.on('new-message', (message: ChatMessage) => {
          console.log('Received new message:', message);
          setMessages(prev => [...prev, message]);
        });

        setSocket(socketInstance);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socketLoaded]);

  // Room management functions
  const createRoom = useCallback((customCode?: string) => {
    if (!socket) return;
    
    const roomId = customCode || Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.emit('create-room', {
      roomId,
      contentId,
      contentType,
      userName
    });
    
    return roomId;
  }, [socket, contentId, contentType, userName]);

  const joinRoom = useCallback((roomCode: string) => {
    if (!socket) return;
    
    socket.emit('join-room', {
      roomId: roomCode.toUpperCase(),
      userName
    });
  }, [socket, userName]);

  const createRandomRoom = useCallback(() => {
    if (!socket) return;
    
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return createRoom(randomCode);
  }, [socket, createRoom]);

  const leaveRoom = useCallback(() => {
    if (socket && room?.id) {
      console.log('Leaving room:', room.id);
      socket.disconnect();
      setIsInRoom(false);
      setRoom(null);
      setMessages([]);
      setUsers([]);
    }
  }, [socket, room?.id]);

  // Video control functions (only for host)
  const playVideo = useCallback((currentTime: number) => {
    if (socket && room?.id && isHost) {
      console.log('Host sending video-play event:', currentTime);
      socket.emit('video-play', { roomId: room.id, currentTime });
    }
  }, [socket, room?.id, isHost]);

  const pauseVideo = useCallback((currentTime: number) => {
    if (socket && room?.id && isHost) {
      console.log('Host sending video-pause event:', currentTime);
      socket.emit('video-pause', { roomId: room.id, currentTime });
    }
  }, [socket, room?.id, isHost]);

  const seekVideo = useCallback((currentTime: number) => {
    if (socket && room?.id && isHost) {
      console.log('Host sending video-seek event:', currentTime);
      socket.emit('video-seek', { roomId: room.id, currentTime });
    }
  }, [socket, room?.id, isHost]);

  // Chat functions
  const sendMessage = useCallback((message: string) => {
    if (socket && room?.id && message.trim()) {
      console.log('Sending message to room:', room.id, 'Message:', message.trim());
      socket.emit('send-message', { roomId: room.id, message: message.trim() });
    } else {
      console.log('Cannot send message - socket:', !!socket, 'roomId:', room?.id, 'message:', message.trim());
    }
  }, [socket, room?.id]);

  // Register video callbacks
  const registerVideoCallbacks = useCallback((callbacks: {
    onPlay?: (time: number) => void;
    onPause?: (time: number) => void;
    onSeek?: (time: number) => void;
  }) => {
    videoCallbacks.current = callbacks;
  }, []);

  return {
    // Connection state
    isConnected,
    isInRoom,
    isHost,
    
    // Room data
    room,
    users,
    messages,
    syncState,
    
    // Room management
    createRoom,
    joinRoom,
    leaveRoom,
    createRandomRoom,
    
    // Video controls (host only)
    playVideo,
    pauseVideo,
    seekVideo,
    
    // Chat
    sendMessage,
    
    // Video integration
    registerVideoCallbacks
  };
}