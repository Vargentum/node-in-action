const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient()

const user = {
  init(obj) {
    for (let key in obj) {
      this[key] = obj[key]
    }
  },
  save(fn) {
    if (this.id) this.update(fn)
    else {
      db.incr('user:ids', (err, id) => {
        if (err) return fn(err)
        this.id = id
        this.hashPassword((err) => {
          if (err) return fn(err)
          this.update(fn)
        })
      })
    }
  },
  update(fn) {
    db.set(`user:id:${this.name}`, this.id, (err) => {
      if (err) return fn(err)
      db.hmset(`user:${this.id}`, this, (err) => fn(err))    
    })
  },
  hashPassword(fn) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return fn(err)
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return fn(err)
        this.pass = hash
        fn()
      })
    })
  }
}


const tobi = Object.create(user)
tobi.init({
  name: 'Tobi',
  pass: 'someTextPassword',
  age: '2'
})

tobi.save((err) => {
  if (err) throw err
  console.log(tobi.id, 'tobi.id---------')
})

/*
TODO:
  
  init Redis DB

  create User prototype with 
  
  .init(o) => populate context with o content
  .save(fn) =>
    if id exist - make .update
    else 
      incr user:ids
      set user:id equal last of user:ids (get it inside callback)
      .hashPassword => user.update(fn)    

  .update(fn) =>
    set user:id:name


  3 'storages' in general:

  user:ids - string, repr users in total
  user:id:name - hash, repr users ids: userdata
    user:id - user value ?? (is it isnide user:id:name?)








  useful functions
    .createClient
    db.set
    db.hmset
    db.incr

    .hashPassword
*/