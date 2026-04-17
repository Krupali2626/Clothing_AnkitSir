import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join', (data) => {
            const { userId, tokenHash } = data;
            if (userId) {
                // Join user room
                socket.join(userId.toString());
                console.log(`User ${userId} joined their notification room`);
                
                // Also join a specific session room if tokenHash provided
                if (tokenHash) {
                    const sessionRoom = `${userId}-${tokenHash}`;
                    socket.join(sessionRoom);
                    console.log(`User ${userId} joined session room: ${sessionRoom}`);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

export const getIO = () => {
    return io;
};

export const sendRealTimeNotification = (userId, notification) => {
    if (io && userId) {
        io.to(userId.toString()).emit('new-notification', notification);
    }
};

export const sendSessionRevoked = (userId, tokenHash) => {
    if (io && userId && tokenHash) {
        const sessionRoom = `${userId}-${tokenHash}`;
        console.log(`Emitting session-revoked to session room: ${sessionRoom}`);
        io.to(sessionRoom).emit('session-revoked', { tokenHash });
    }
};

export const sendLogoutAllDevices = (userId) => {
    if (io && userId) {
        console.log(`Emitting logout-all-devices to user ${userId}`);
        io.to(userId.toString()).emit('logout-all-devices');
    }
};
