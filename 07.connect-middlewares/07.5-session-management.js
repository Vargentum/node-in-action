var connect = require('connect')
var RedisStore = require('connect-redis')(connect) // Alows RedisStore to inherit from connect SessionStore.prototype
var cookieParser = require('cookie-parser')


connect()
  .use(cookieParser())
  .use(connect.session({
    store: new RedisStore({prefix: 'sid'})
  }))

