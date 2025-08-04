const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory storage for rooms
const rooms = {};

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
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
    console.log('User connected:', socket.id);

    // Create room
    socket.on('create-room', ({ roomId, contentId, contentType, userName }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          id: roomId,
          name: `Room ${roomId}`,
          currentTime: 0,
          isPlaying: false,
          host: socket.id,
          users: {},
          messages: [],
          ...(contentType === 'movie' && { movieId: contentId }),
          ...(contentType === 'tv' && { tvShowId: contentId }),
          ...(contentType === 'anime' && { animeId: contentId })
        };
      }
      
      socket.join(roomId);
      rooms[roomId].users[socket.id] = {
        id: socket.id,
        name: userName,
        isHost: socket.id === rooms[roomId].host
      };
      
      socket.emit('room-joined', {
        room: rooms[roomId],
        isHost: socket.id === rooms[roomId].host
      });
      
      console.log(`User ${userName} created/joined room ${roomId}`);
    });

    // Join room
    socket.on('join-room', ({ roomId, userName }) => {
      if (!rooms[roomId]) {
        socket.emit('room-error', { message: 'Room not found' });
        return;
      }
      
      socket.join(roomId);
      rooms[roomId].users[socket.id] = {
        id: socket.id,
        name: userName,
        isHost: false
      };
      
      socket.emit('room-joined', {
        room: rooms[roomId],
        isHost: false
      });
      
      socket.to(roomId).emit('user-joined', {
        user: rooms[roomId].users[socket.id],
        userCount: Object.keys(rooms[roomId].users).length
      });
      
      // Send current state to new user
      socket.emit('sync-state', {
        currentTime: rooms[roomId].currentTime,
        isPlaying: rooms[roomId].isPlaying
      });
      
      console.log(`User ${userName} joined room ${roomId}`);
    });

    // Handle video sync events
    socket.on('video-play', ({ roomId, currentTime }) => {
      if (rooms[roomId] && rooms[roomId].users[socket.id]?.isHost) {
        rooms[roomId].isPlaying = true;
        rooms[roomId].currentTime = currentTime;
        socket.to(roomId).emit('video-play', { currentTime });
        console.log(`Host played video in room ${roomId} at ${currentTime}`);
      }
    });

    socket.on('video-pause', ({ roomId, currentTime }) => {
      if (rooms[roomId] && rooms[roomId].users[socket.id]?.isHost) {
        rooms[roomId].isPlaying = false;
        rooms[roomId].currentTime = currentTime;
        socket.to(roomId).emit('video-pause', { currentTime });
        console.log(`Host paused video in room ${roomId} at ${currentTime}`);
      }
    });

    socket.on('video-seek', ({ roomId, currentTime }) => {
      if (rooms[roomId] && rooms[roomId].users[socket.id]?.isHost) {
        rooms[roomId].currentTime = currentTime;
        socket.to(roomId).emit('video-seek', { currentTime });
        console.log(`Host seeked video in room ${roomId} to ${currentTime}`);
      }
    });

    // Handle chat messages
    socket.on('send-message', ({ roomId, message }) => {
      if (rooms[roomId] && rooms[roomId].users[socket.id]) {
        const chatMessage = {
          id: uuidv4(),
          userId: socket.id,
          userName: rooms[roomId].users[socket.id].name,
          message,
          timestamp: Date.now()
        };
        
        rooms[roomId].messages.push(chatMessage);
        
        // Keep only last 100 messages
        if (rooms[roomId].messages.length > 100) {
          rooms[roomId].messages = rooms[roomId].messages.slice(-100);
        }
        
        io.to(roomId).emit('new-message', chatMessage);
        console.log(`Message sent in room ${roomId}: ${message}`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from all rooms
      Object.keys(rooms).forEach(roomId => {
        if (rooms[roomId].users[socket.id]) {
          const userName = rooms[roomId].users[socket.id].name;
          delete rooms[roomId].users[socket.id];
          
          // If room is empty, delete it
          if (Object.keys(rooms[roomId].users).length === 0) {
            delete rooms[roomId];
            console.log(`Room ${roomId} deleted (empty)`);
          } else {
            // If host left, assign new host
            if (rooms[roomId].host === socket.id) {
              const newHostId = Object.keys(rooms[roomId].users)[0];
              rooms[roomId].host = newHostId;
              rooms[roomId].users[newHostId].isHost = true;
              
              socket.to(roomId).emit('new-host', {
                newHostId,
                newHostName: rooms[roomId].users[newHostId].name
              });
              
              console.log(`New host assigned in room ${roomId}: ${rooms[roomId].users[newHostId].name}`);
            }
            
            socket.to(roomId).emit('user-left', {
              userId: socket.id,
              userCount: Object.keys(rooms[roomId].users).length
            });
          }
          
          console.log(`User ${userName} left room ${roomId}`);
        }
      });
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