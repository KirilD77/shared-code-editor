const io = require('socket.io')(4000, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('code', (code, room) => {
    console.log(code);
    if (room) {
      socket.to(room).emit('receiveCode', code);
    }
    return;
  });

  socket.on('join-room', (room) => {
    console.log(`${socket.id} joined ${room}`);
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} closed the connection`);
  });
});
