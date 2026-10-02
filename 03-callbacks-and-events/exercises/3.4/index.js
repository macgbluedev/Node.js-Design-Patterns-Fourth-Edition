// 3.4 Playing with errors: Modify the function created in exercise 3.3 so that it 
// produces an error if the timestamp at the moment of a tick (including the initial
//      one that we added as part of exercise 3.3) is divisible by 5. Propagate the 
//      error using both the callback and the event emitter. Hint: use Date.now() to 
//      get the timestamp and the remainder (%) operator to check whether the timestamp 
//      is divisible by 5.

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

    const timestamp = Date.now() - start;

    if(timestamp % 5)
    {
        throw new Error("The timestamp is divisible by 5");
    }
    else if (timestamp >= ms) {
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
