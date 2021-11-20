const codesAndRooms = {};
const io = require('socket.io')(4000, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('code', (code, room) => {
    console.log(code);
    codesAndRooms[room] = code;
    console.log(`code in object ${codesAndRooms[room]}`);
    if (room) {
      socket.to(room).emit('receiveCode', code);
    }
    return;
  });

  socket.on('join-room', (room) => {
    console.log(`${socket.id} joined ${room}`);
    socket.join(room);

    let code = codesAndRooms[room];
    console.log();
    if (code === undefined) {
      code = '';
    }
    socket.emit('receiveCode', code);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} closed the connection`);
  });
});
