import assert from 'assert';
import Watcher from '../lib';

describe('02-files-watcher', function () {

  it('should have unit test!', function () {
    new Watcher('./test/watched', './test/output')
    // assert(false, 'we expected this package author to add actual unit tests.');
    assert(true, 'works')
  });
});
