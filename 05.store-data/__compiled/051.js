'use strict';

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var fs = (0, _promisifyNode2.default)('fs');

var _process$argv = _toArray(process.argv);

var command = _process$argv[2];

var newTasks = _process$argv.slice(3);

var file = _path2.default.resolve(__dirname, './tasks.json');

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
  case 'list':
    listTasks(file);break;
  case 'add':
    addTasks(file, newTasks);break;
  default:
    console.log('Type "list" to list all tasks, "add" to add a new one.');
}

/* -----------------------------
  Helpers
----------------------------- */
function verifyStats(stats) {
  if (!stats.isFile()) throw new Error(stats + ' isn\'t a file');
}

function catchE(err) {
  console.log(err, err.stack, '---------');
}

/* -----------------------------
  Listing
----------------------------- */
function loadOrInitTasks(file) {
  var initTasks = [];
  return fs.stat(file).then(function (stats) {
    verifyStats(stats);
    return fs.readFile(file, 'utf8');
  }).catch(catchE).then(function (content) {
    var tasks = JSON.parse(content.toString());
    return tasks && tasks.length ? tasks : initTasks;
  }).catch(catchE);
}
function listTasks(file) {
  loadOrInitTasks(file).then(function (tasks) {
    if (tasks.length) {
      tasks.forEach(function (t) {
        return console.log(t);
      });
    } else {
      console.log('There arent any task yet', '---------');
    }
  }).catch(catchE);
}

/* -----------------------------
  Addition
----------------------------- */
function storeTasks(file, tasks) {
  return fs.stat(file).then(function (stats) {
    verifyStats(stats);
    return fs.writeFile(file, tasks);
  }).catch(catchE);
}

function addTasks(file, newTasks) {
  loadOrInitTasks(file).then(function (savedTasks) {
    storeTasks(file, JSON.stringify([].concat(_toConsumableArray(savedTasks), _toConsumableArray(newTasks))));
    console.log('Successfully add ' + newTasks.join(' '));
  }).catch(catchE);
}
