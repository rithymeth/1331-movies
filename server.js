const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const MAX_CHAT_MESSAGES = 100;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const rooms = {};

function normalizeRoomId(value = '') {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

function normalizeUserName(value = 'Anonymous') {
  const trimmedValue = value.trim().slice(0, 20);
  return trimmedValue || 'Anonymous';
}

function getRoomSignature(contentType, contentId) {
  return `${contentType}:${contentId}`;
}

function getExistingRoomSignature(room) {
  if (room.movieId) {
    return getRoomSignature('movie', room.movieId);
  }
  if (room.tvShowId) {
    return getRoomSignature('tv', room.tvShowId);
  }
  if (room.animeId) {
    return getRoomSignature('anime', room.animeId);
  }
  return null;
}

function buildRoom(roomId, socketId, contentId, contentType) {
  return {
    id: roomId,
    name: `Room ${roomId}`,
    currentTime: 0,
    isPlaying: false,
    host: socketId,
    users: {},
    messages: [],
    ...(contentType === 'movie' && { movieId: contentId }),
    ...(contentType === 'tv' && { tvShowId: contentId }),
    ...(contentType === 'anime' && { animeId: contentId })
  };
}

function getRoomSnapshot(room) {
  return {
    ...room,
    users: Object.fromEntries(
      Object.values(room.users).map((user) => [
        user.id,
        { ...user, isHost: user.id === room.host }
      ])
    ),
    messages: room.messages.slice(-MAX_CHAT_MESSAGES)
  };
}

function emitRoomState(io, roomId) {
  const room = rooms[roomId];
  if (!room) {
    return;
  }

  io.to(roomId).emit('room-state', {
    room: getRoomSnapshot(room)
  });
}

function removeUserFromRoom(io, socket, roomId) {
  const room = rooms[roomId];
  if (!room || !room.users[socket.id]) {
    return;
  }

  const userName = room.users[socket.id].name;
  delete room.users[socket.id];
  socket.leave(roomId);

  if (Object.keys(room.users).length === 0) {
    delete rooms[roomId];
    return;
  }

  if (room.host === socket.id) {
    const [newHostId] = Object.keys(room.users);
    room.host = newHostId;
    io.to(roomId).emit('new-host', {
      newHostId,
      newHostName: room.users[newHostId].name
    });
  }

  socket.to(roomId).emit('user-left', {
    userId: socket.id,
    userName,
    userCount: Object.keys(room.users).length
  });
  emitRoomState(io, roomId);
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('create-room', ({ roomId, contentId, contentType, userName }) => {
      const normalizedRoomId = normalizeRoomId(roomId) || normalizeRoomId(Math.random().toString(36).slice(2, 8));
      const normalizedUserName = normalizeUserName(userName);

      if (!['movie', 'tv', 'anime'].includes(contentType) || !contentId) {
        socket.emit('room-error', { message: 'Invalid room details' });
        return;
      }

      const existingRoom = rooms[normalizedRoomId];
      if (existingRoom && getExistingRoomSignature(existingRoom) !== getRoomSignature(contentType, String(contentId))) {
        socket.emit('room-error', { message: 'Room code is already in use for different content' });
        return;
      }

      const previousRoomId = socket.data.currentRoomId;
      if (previousRoomId && previousRoomId !== normalizedRoomId) {
        removeUserFromRoom(io, socket, previousRoomId);
      }

      const room = existingRoom || buildRoom(normalizedRoomId, socket.id, String(contentId), contentType);
      rooms[normalizedRoomId] = room;

      socket.join(normalizedRoomId);
      socket.data.currentRoomId = normalizedRoomId;
      room.users[socket.id] = {
        id: socket.id,
        name: normalizedUserName,
        isHost: socket.id === room.host
      };

      socket.emit('room-joined', {
        room: getRoomSnapshot(room),
        isHost: socket.id === room.host
      });
      socket.emit('sync-state', {
        currentTime: room.currentTime,
        isPlaying: room.isPlaying
      });
      emitRoomState(io, normalizedRoomId);
    });

    socket.on('join-room', ({ roomId, userName }) => {
      const normalizedRoomId = normalizeRoomId(roomId);
      const room = rooms[normalizedRoomId];
      if (!room) {
        socket.emit('room-error', { message: 'Room not found' });
        return;
      }

      const previousRoomId = socket.data.currentRoomId;
      if (previousRoomId && previousRoomId !== normalizedRoomId) {
        removeUserFromRoom(io, socket, previousRoomId);
      }

      socket.join(normalizedRoomId);
      socket.data.currentRoomId = normalizedRoomId;
      room.users[socket.id] = {
        id: socket.id,
        name: normalizeUserName(userName),
        isHost: socket.id === room.host
      };

      socket.emit('room-joined', {
        room: getRoomSnapshot(room),
        isHost: socket.id === room.host
      });
      socket.emit('sync-state', {
        currentTime: room.currentTime,
        isPlaying: room.isPlaying
      });
      socket.to(normalizedRoomId).emit('user-joined', {
        user: room.users[socket.id],
        userCount: Object.keys(room.users).length
      });
      emitRoomState(io, normalizedRoomId);
    });

    socket.on('leave-room', ({ roomId }) => {
      const normalizedRoomId = normalizeRoomId(roomId || socket.data.currentRoomId || '');
      if (!normalizedRoomId) {
        return;
      }

      removeUserFromRoom(io, socket, normalizedRoomId);
      if (socket.data.currentRoomId === normalizedRoomId) {
        socket.data.currentRoomId = null;
      }
      socket.emit('room-left', { roomId: normalizedRoomId });
    });

    socket.on('video-play', ({ roomId, currentTime }) => {
      const normalizedRoomId = normalizeRoomId(roomId);
      if (rooms[normalizedRoomId] && rooms[normalizedRoomId].users[socket.id]?.isHost && Number.isFinite(currentTime)) {
        rooms[normalizedRoomId].isPlaying = true;
        rooms[normalizedRoomId].currentTime = currentTime;
        socket.to(normalizedRoomId).emit('video-play', { currentTime });
        emitRoomState(io, normalizedRoomId);
      }
    });

    socket.on('video-pause', ({ roomId, currentTime }) => {
      const normalizedRoomId = normalizeRoomId(roomId);
      if (rooms[normalizedRoomId] && rooms[normalizedRoomId].users[socket.id]?.isHost && Number.isFinite(currentTime)) {
        rooms[normalizedRoomId].isPlaying = false;
        rooms[normalizedRoomId].currentTime = currentTime;
        socket.to(normalizedRoomId).emit('video-pause', { currentTime });
        emitRoomState(io, normalizedRoomId);
      }
    });

    socket.on('video-seek', ({ roomId, currentTime }) => {
      const normalizedRoomId = normalizeRoomId(roomId);
      if (rooms[normalizedRoomId] && rooms[normalizedRoomId].users[socket.id]?.isHost && Number.isFinite(currentTime)) {
        rooms[normalizedRoomId].currentTime = currentTime;
        socket.to(normalizedRoomId).emit('video-seek', { currentTime });
        emitRoomState(io, normalizedRoomId);
      }
    });

    socket.on('send-message', ({ roomId, message }) => {
      const normalizedRoomId = normalizeRoomId(roomId);
      const room = rooms[normalizedRoomId];
      const user = room?.users[socket.id];
      const normalizedMessage = typeof message === 'string' ? message.trim().slice(0, 200) : '';

      if (!room || !user || !normalizedMessage) {
        return;
      }

      const chatMessage = {
        id: uuidv4(),
        userId: socket.id,
        userName: user.name,
        message: normalizedMessage,
        timestamp: Date.now()
      };

      room.messages = [...room.messages, chatMessage].slice(-MAX_CHAT_MESSAGES);
      io.to(normalizedRoomId).emit('new-message', chatMessage);
      emitRoomState(io, normalizedRoomId);
    });

    socket.on('disconnect', () => {
      const currentRoomId = socket.data.currentRoomId;
      if (currentRoomId) {
        removeUserFromRoom(io, socket, currentRoomId);
      }
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
