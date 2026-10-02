// 3.3 A simple modification: Modify the function created in exercise 3.2 so that
//  it emits a tick event immediately after the function is invoked.

import { EventEmitter } from "node:events"

const TICK_INTERVAL = 50

function ticker(ms, cb) {
  const emitter = new EventEmitter()
  const start = Date.now()
  let count = 0

  const tick = () => {
    count++
    emitter.emit("tick")
  }

  const scheduleTick = () => {
    setTimeout(() => {
      tick()

      if (Date.now() - start >= ms) {
        return cb(count)
      }
      scheduleTick()
    }, TICK_INTERVAL)
  }

  // emitting synchronously would fire before the caller can attach a
  // listener, so the immediate tick is deferred to the next tick of the loop
  process.nextTick(() => {
    tick()
    scheduleTick()
  })

  return emitter
}

ticker(400, (total) => console.log("Total ticks:", total)).on("tick", () =>
  console.log("tick")
)
