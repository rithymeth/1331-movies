'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

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

export function useWatchTogether({
  contentId,
  contentType,
  userName = 'Anonymous'
}: UseWatchTogetherProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<WatchRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [syncState, setSyncState] = useState({ currentTime: 0, isPlaying: false });
  const socketRef = useRef<Socket | null>(null);

  const videoCallbacks = useRef<{
    onPlay?: (time: number) => void;
    onPause?: (time: number) => void;
    onSeek?: (time: number) => void;
  }>({});

  const applyRoomState = useCallback((nextRoom: WatchRoom | null, hostOverride?: boolean) => {
    setRoom(nextRoom);
    setMessages(nextRoom?.messages || []);
    setUsers(nextRoom ? Object.values(nextRoom.users) : []);
    setIsInRoom(Boolean(nextRoom));
    setIsHost(hostOverride ?? (nextRoom ? socketRef.current?.id === nextRoom.host : false));
    if (nextRoom) {
      setSyncState({
        currentTime: nextRoom.currentTime,
        isPlaying: nextRoom.isPlaying
      });
    }
  }, []);

  useEffect(() => {
    let isDisposed = false;
    let activeSocket: Socket | null = null;

    const connectSocket = async () => {
      const { io } = await import('socket.io-client');
      if (isDisposed) {
        return;
      }

      activeSocket = io();
      socketRef.current = activeSocket;
      setSocket(activeSocket);

      activeSocket.on('connect', () => {
        setIsConnected(true);
        setRoomError('');
      });

      activeSocket.on('disconnect', () => {
        setIsConnected(false);
        applyRoomState(null, false);
      });

      activeSocket.on('room-joined', ({ room: joinedRoom, isHost: hostStatus }) => {
        setRoomError('');
        applyRoomState(joinedRoom, hostStatus);
      });

      activeSocket.on('room-state', ({ room: roomState }) => {
        applyRoomState(roomState);
      });

      activeSocket.on('room-left', () => {
        setRoomError('');
        applyRoomState(null, false);
      });

      activeSocket.on('room-error', ({ message }) => {
        setRoomError(message || 'Unable to join room');
      });

      activeSocket.on('user-joined', ({ user }) => {
        setUsers((prev) => [...prev.filter((entry) => entry.id !== user.id), user]);
      });

      activeSocket.on('user-left', ({ userId }) => {
        setUsers((prev) => prev.filter((entry) => entry.id !== userId));
      });

      activeSocket.on('new-host', ({ newHostId }) => {
        setUsers((prev) => prev.map((entry) => ({ ...entry, isHost: entry.id === newHostId })));
        setIsHost(activeSocket?.id === newHostId);
      });

      activeSocket.on('sync-state', ({ currentTime, isPlaying }) => {
        setSyncState({ currentTime, isPlaying });
        if (isPlaying) {
          videoCallbacks.current.onPlay?.(currentTime);
        } else {
          videoCallbacks.current.onPause?.(currentTime);
        }
      });

      activeSocket.on('video-play', ({ currentTime }) => {
        setSyncState({ currentTime, isPlaying: true });
        videoCallbacks.current.onPlay?.(currentTime);
      });

      activeSocket.on('video-pause', ({ currentTime }) => {
        setSyncState({ currentTime, isPlaying: false });
        videoCallbacks.current.onPause?.(currentTime);
      });

      activeSocket.on('video-seek', ({ currentTime }) => {
        setSyncState((prev) => ({ ...prev, currentTime }));
        videoCallbacks.current.onSeek?.(currentTime);
      });

      activeSocket.on('new-message', (message: ChatMessage) => {
        setMessages((prev) => [...prev, message].slice(-100));
      });
    };

    connectSocket();

    return () => {
      isDisposed = true;
      activeSocket?.disconnect();
      socketRef.current = null;
    };
  }, [applyRoomState]);

  const createRoom = useCallback((customCode?: string) => {
    if (!socketRef.current) {
      return;
    }

    const roomId = (customCode || Math.random().toString(36).substring(2, 8)).toUpperCase();
    setRoomError('');
    socketRef.current.emit('create-room', {
      roomId,
      contentId,
      contentType,
      userName
    });
    return roomId;
  }, [contentId, contentType, userName]);

  const joinRoom = useCallback((roomCode: string) => {
    if (!socketRef.current) {
      return;
    }

    setRoomError('');
    socketRef.current.emit('join-room', {
      roomId: roomCode.trim().toUpperCase(),
      userName
    });
  }, [userName]);

  const createRandomRoom = useCallback(() => {
    return createRoom(Math.random().toString(36).substring(2, 8));
  }, [createRoom]);

  const leaveRoom = useCallback(() => {
    if (socketRef.current && room?.id) {
      socketRef.current.emit('leave-room', { roomId: room.id });
    }
  }, [room?.id]);

  const playVideo = useCallback((currentTime: number) => {
    if (socketRef.current && room?.id && isHost) {
      socketRef.current.emit('video-play', { roomId: room.id, currentTime });
    }
  }, [room?.id, isHost]);

  const pauseVideo = useCallback((currentTime: number) => {
    if (socketRef.current && room?.id && isHost) {
      socketRef.current.emit('video-pause', { roomId: room.id, currentTime });
    }
  }, [room?.id, isHost]);

  const seekVideo = useCallback((currentTime: number) => {
    if (socketRef.current && room?.id && isHost) {
      socketRef.current.emit('video-seek', { roomId: room.id, currentTime });
    }
  }, [room?.id, isHost]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && room?.id && message.trim()) {
      socketRef.current.emit('send-message', { roomId: room.id, message: message.trim() });
    }
  }, [room?.id]);

  const registerVideoCallbacks = useCallback((callbacks: {
    onPlay?: (time: number) => void;
    onPause?: (time: number) => void;
    onSeek?: (time: number) => void;
  }) => {
    videoCallbacks.current = callbacks;
  }, []);

  return {
    isConnected,
    isInRoom,
    isHost,
    room,
    users,
    messages,
    roomError,
    syncState,
    socket,
    createRoom,
    joinRoom,
    leaveRoom,
    createRandomRoom,
    playVideo,
    pauseVideo,
    seekVideo,
    sendMessage,
    registerVideoCallbacks
  };
}
