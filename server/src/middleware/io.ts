import socketIO from 'socket.io';
import { Server } from 'http';

export const startSocketIO = (server: Server) => {
  const io = socketIO(server);
  const MESSAGE_TIMEOUT = 5000;

  io.on('connection', client => {
    console.log('New client');
    setInterval(() => {
      client.emit('message', {
        type: 'message',
        message: new Date().getTime().toString(),
      });
    }, MESSAGE_TIMEOUT);
  });
}
