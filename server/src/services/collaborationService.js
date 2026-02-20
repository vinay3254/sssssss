import { Server } from 'socket.io';

class CollaborationService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });
    
    this.rooms = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('join-room', ({ roomId, user }) => {
        socket.join(roomId);
        
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Map());
        }
        
        this.rooms.get(roomId).set(socket.id, { ...user, socketId: socket.id });
        
        const roomUsers = Array.from(this.rooms.get(roomId).values());
        this.io.to(roomId).emit('users-updated', roomUsers);
        
        console.log(`User ${user.name} joined room ${roomId}`);
      });

      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        
        if (this.rooms.has(roomId)) {
          this.rooms.get(roomId).delete(socket.id);
          const roomUsers = Array.from(this.rooms.get(roomId).values());
          this.io.to(roomId).emit('users-updated', roomUsers);
        }
      });

      socket.on('slide-updated', ({ roomId, slideData }) => {
        socket.to(roomId).emit('slide-changed', slideData);
      });

      socket.on('cursor-move', ({ roomId, position }) => {
        const user = this.getUserFromSocket(socket.id);
        if (user) {
          socket.to(roomId).emit('cursor-moved', { 
            userId: socket.id, 
            userName: user.name,
            position 
          });
        }
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  getUserFromSocket(socketId) {
    for (const [roomId, users] of this.rooms.entries()) {
      if (users.has(socketId)) {
        return users.get(socketId);
      }
    }
    return null;
  }

  handleDisconnect(socketId) {
    for (const [roomId, users] of this.rooms.entries()) {
      if (users.has(socketId)) {
        users.delete(socketId);
        const roomUsers = Array.from(users.values());
        this.io.to(roomId).emit('users-updated', roomUsers);
        
        if (users.size === 0) {
          this.rooms.delete(roomId);
        }
        break;
      }
    }
  }
}

export default CollaborationService;