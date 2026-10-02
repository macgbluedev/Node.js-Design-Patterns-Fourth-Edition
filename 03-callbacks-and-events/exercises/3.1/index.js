//*3.1 A simple event: Modify the asynchronous FindRegex class so that it emits an
// event when the find process starts, passing the input files list as an argument. Hint: beware of Zalgo!

import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs'

class FindRegex extends EventEmitter {
  constructor(regex) {
    super()
    this.regex = regex
    this.files = []
  }

  addFile(file) {
    this.files.push(file)
    return this
  }

  find() {
    // Deferring the emit (and the reads) guarantees 'start' is always
    // emitted asynchronously, after the caller has attached its listeners.
    process.nextTick(() => {
      this.emit('start', this.files)

      for (const file of this.files) {
        readFile(file, 'utf8', (err, content) => {
          if (err) {
            return this.emit('error', err)
          }

          this.emit('fileread', file)
          const match = content.match(this.regex)
          if (match) {
            for (const elem of match) {
              this.emit('found', file, elem)
            }
          }
        })
      }
    })
    return this
  }
}

const findRegexInstance = new FindRegex(/hello [\w.]+/)
findRegexInstance
  .addFile(new URL('fileA.txt', import.meta.url))
  .addFile(new URL('fileB.json', import.meta.url))
  .find()
  .on('start', files => console.log(`Find started with files: ${files.map(String).join(', ')}`))
  .on('fileread', file => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`Matched "${match}" in ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))

console.log('Hello world from here')
