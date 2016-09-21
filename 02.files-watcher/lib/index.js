import fs from 'fs'
import EventEmitter from 'events'

function handlePossibleError(err) {
  if (err) throw new Error(err);
}

class WatcherLogger extends EventEmitter {
  constructor() {
    super();
    this.on('rename', this.logRename.bind(this));
  }
  logRename(err, data) {
    handlePossibleError(err);
    console.log(`successfull renaming for ${data}`);
  }
}

class Watcher extends EventEmitter {
  constructor(watchDir, processDir) {
    super();
    this.watchDir = watchDir;
    this.processDir = processDir;
    this.watch();
    this.emit('watch');
  }
  handleFileProcessing(err, data) {
    handlePossibleError(err);
    this.emit('rename');
  }
  processFile(file) {
    fs.rename(
      `${this.watchDir}/${file}`,
      `${this.processDir}/renamed-${file.toLowerCase()}`,
      this.handleFileProcessing.bind(this)
    )
  }
  processInputDirContent(err) {
    handlePossibleError(err, 'Unknown error');
    fs.readdir(this.watchDir, (err, files) => {
      handlePossibleError(err);
      files.forEach(this.processFile.bind(this));
    });
  }
  watch() {
    this.on('watch', this.processInputDirContent.bind(this));
  }
}

export default Watcher;
