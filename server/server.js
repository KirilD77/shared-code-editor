const codesAndRooms = {};
const io = require('socket.io')(4000, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('code', (code, room) => {
    const codes = code.split("..");
    console.log("html: ", codes[0]);
    console.log("css: ", codes[1]);
    console.log("js: ", codes[2]);

    codesAndRooms[room] = code;
    if (room) {
      socket.to(room).emit('receiveCode', code);
    }
    return;
  });

  socket.on('join-room', (room) => {
    console.log(`${socket.id} joined ${room}`);
    socket.join(room);

    let code = codesAndRooms[room];
    if (code === undefined) {
      code = '';
    }
    socket.emit('receiveCode', code);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} closed the connection`);
  });
});
