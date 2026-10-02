// 3.2 Ticker: Write a function that accepts a number and a callback as the arguments.
// The function will return an EventEmitter that emits an event called tick every 50
// milliseconds until the number of milliseconds is passed from the invocation of the
// function. The function will also call the callback when the number of milliseconds
// has passed, providing, as the result, the total count of tick events emitted.

import { EventEmitter } from "node:events"

const TICK_INTERVAL = 50

function ticker(ms, cb) {
  const emitter = new EventEmitter()
  const start = Date.now()
  let count = 0

  const scheduleTick = () => {
    setTimeout(() => {
      // the timer is always async, so listeners attached right after
      // calling ticker() will not miss any event
      count++
      emitter.emit("tick")

      if (Date.now() - start >= ms) {
        return cb(count)
      }
      scheduleTick()
    }, TICK_INTERVAL)
  }

  scheduleTick()
  return emitter
}

ticker(1200, (total) => console.log("Total ticks:", total))
    .on("tick", () => console.log("tick"))
