var Chat = {
  sendMessage: function(room, text) {
    this.socket.emit('message', {
      room: room,
      text: text
    })
  },
  changeRoom: function (room) {
    this.socket.emit('join', {
      newRoom: room
    })
  },
  /*proccess command: with following format -> /keyword message
    get commands array (splitted by whitespaces)
  */
  processCommand: function(command) {
    var words = command.split(' ')
    var keyword = words[0]
      .substring(1, words[0].length)
      .toLowerCase()
    var message = null

    switch (keyword) {
      case 'nick':
        words.shift()
        var name = words.join(' ')
        this.socket.emit('nameAttempt', name)
        break;
      case 'join':
        words.shift()
        var room = words.join(' ')
        this.changeRoom(room)
        break;
      default:
        message = 'Unrecognized command'
    }
    return message
  }
}
