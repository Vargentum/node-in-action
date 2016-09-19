var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};


module.exports = function listen(server) {
  io = sockitio.listen(server)  // start socket.io allow to piggyback the existing server
  io.set('log level', 1)

  io.sockets.on('connection', function(socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, 'Lobby')
    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)
  })

  io.sockets.on('rooms', function(socket) {
    socket.emit('rooms', io.sockets.manager.rooms)
  })

  handleClientDisconnection(socket, nickNames, namesUsed) //clean-up logic
}


/*
guestNumber:
  - create nick name with incremental id
  - store nn in association with socket internal id
  - emit 'nameResult' => {success: true, name: nn}
  - store nn in namesUsed
  - increemnt counter
*/

function guestNumber (socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest ' + guestNumber
  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name: name
  })
  namesUsed.push(name)
  return guestNumber + 1
}


/*
  JOIN ROOM functionality

  socket -> client with you work now !

  set currentRoom of socket to room
  emit success Join message
  broadcast to room -> message -> user `nickname` was joined to the `room`
  get room clients (io.sockets.clients)
  collect user names, and send -> message to joined user
*/

function joinRoom(socket, room) {
  socket.join(room)

  currentRoom[socket.id] = room
  socket.emit('joinRoom', {success: true})
  socket.to(room, {
    text: 'User ' + nickNames[socket.id] + ' was joined to the room ' + room
  })
  var usersInRoom = io.sockets.clients(room)
  var usersInRoomSummary = usersInRoom.reduce((usersString, user) => {
    if (user.id === socket.id) {
      return usersString
    } else {
      return usersString + ', ' + nickNames[user.id]
    }
  }, '')

  socket.emit('message', {
    text: usersInRoomSummary
  })
}


/*
  handleNameChangeAttempts

  add listener for `nameAttempt` event
  disallow creation 'Guest' contain names -> send error message
  if name has been registered -> send error message
  else ->
    register it
    change previous User name to new name
    delete old name from namesUsed, to make it avail for new users
    emit message

    broadcast to room where user is located -> user change his name
*/

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(newName) {
    if (newName.indexOf('Guest',0) !== -1) {
      socket.emit('nameResult', {
        success: false,
        message: 'Name can not begins with "Guest"'
      })
    } else {
      if (nickNames[newName]) {
        socket.emit('nameResult', {
          success: false,
          message: "Name " + newName + " has been already taken"
        })
      } else {
        var oldName = nickNames[socket.id]
        var oldNameIdx = namesUsed.indexOf(oldName)
        nickNames[socket.id] = newName
        namesUsed.push(newName)
        delete namesUsed[oldNameIdx]  
        socket.emit({
          success: true,
          message: "Name successfully changed to " + newName
        })
        socket.to(currentRoom[socket.id]).emit({
          text: "User " + oldName + ' now is known as ' + newName
        })
      }
    }
  })
}


/*handle message broadcasting:
  - on 'message ' event -> broadcast message data to room where user is it
*/

function handleMessageBroadcasting(socket, nickNames) {
  socket.on('message', function (message) {
    socket.to(message.room).emit({
      text: '' + nickNames[socket.id] + ': ' + message.text
    })
  })
}


/* handle room joining: add to existing room or create new one
  C -> S {newroom}
  C <- S {room}
*/

function handleRoomJoining(socket) {
  socket.on('join', function (newRoom) {
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, newRoom)
  })
}


function handleClientDisconnection (socket, nickNames, namesUsed) {
  socket.on('disconnect', function () {
    var name = nickNames[socket.id]
    var nameIdx = namesUsed.indexOf(name)
    delete nickNames[name]
    delete namesUsed[nameIdx]
  })
}