// 3.4 Playing with errors: Modify the function created in exercise 3.3 so that it 
// produces an error if the timestamp at the moment of a tick (including the initial
//      one that we added as part of exercise 3.3) is divisible by 5. Propagate the 
//      error using both the callback and the event emitter. Hint: use Date.now() to 
//      get the timestamp and the remainder (%) operator to check whether the timestamp 
//      is divisible by 5.

import { time } from "node:console";
import { EventEmitter } from "node:events"

const TICK_INTERVAL = 50

function ticker(ms, cb) {
  const emitter = new EventEmitter();
  const start = Date.now();
  let count = 0

  const tick = () => {
    const now = Date.now();

    if(now % 5 === 0)
    {
      const err = new Error("The timestamp is divisible by 5")
      emitter.emit("error", err)
      cb(err)
      return true
    }

    count++
    emitter.emit("tick")
    return false
  }

  const scheduleTick = () => {
    setTimeout(() => {
      if(tick()) return
      const timestamp = Date.now();
      if(timestamp - start >= ms) return cb(null, count)
      scheduleTick
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

ticker(400, (err, total) => {
    if(err) return console.error("Callback error:", err.message)
    console.log("Total ticks:", total)
})
  .on("tick", () => console.log("tick"))
  .on("error", (err) => console.log("Emitter error:", err));
