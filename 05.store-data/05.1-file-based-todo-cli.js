import promisify from 'promisify-node'
import path from 'path'
const fs = promisify('fs')

const [,,command, ...newTasks] = process.argv
const file = path.resolve(__dirname, './tasks.json')

/*CLI TODO tool

get process.args
-> [0] - command, [...1] data
-> commands: 'list', 'add', 'defalult: show help'
-> loadOrInitializeTasksArray(file, cb) - helper (getTasks from JSon or fallback)
-> listTasks (with loadOrInit) - main
-> storeTasks(file, tasks) - helper (serialize JSON and save to file)
-> addTask - main
*/

switch (command) {
  case 'list': listTasks(file); break;
  case 'add': addTasks(file, newTasks); break;
  default: console.log(`Type "list" to list all tasks, "add" to add a new one.`)
}


/* -----------------------------
  Helpers
----------------------------- */
function verifyStats(stats) {
  if (!stats.isFile()) throw new Error(`${stats} isn't a file`)    
}

function catchE(err) {
  console.log(err, err.stack, '---------')
}

/* -----------------------------
  Listing
----------------------------- */
function loadOrInitTasks(file) {
  const initTasks = []
  return fs.stat(file)
    .then((stats) => {
      verifyStats(stats)
      return fs.readFile(file, 'utf8')
    })
    .catch(catchE)
    .then((content) => {
      const tasks = JSON.parse(content.toString())
      return tasks && tasks.length ? tasks : initTasks
    })
    .catch(catchE)
}
function listTasks(file) {
  loadOrInitTasks(file)
    .then((tasks) => {
      if (tasks.length) {
        tasks.forEach((t) => console.log(t))
      }else {
        console.log('There arent any task yet', '---------')
      }
    })
    .catch(catchE)
}

/* -----------------------------
  Addition
----------------------------- */
function storeTasks(file, tasks) {
  return fs.stat(file)
    .then((stats) => {
      verifyStats(stats)
      return fs.writeFile(file, tasks)
    })
    .catch(catchE)
}

function addTasks(file, newTasks) {
  loadOrInitTasks(file)
    .then((savedTasks) => {
      storeTasks(file, JSON.stringify([...savedTasks, ...newTasks]))
      console.log(`Successfully add ${newTasks.join(' ')}`)
    })
    .catch(catchE)
}