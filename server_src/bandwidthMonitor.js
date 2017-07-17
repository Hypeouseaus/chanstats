const log = require("./log")

let bytesReceived = 0
let initTime = Date.now()

let addBytes = (bytes) => {
    bytesReceived += bytes
}

let startNewCycle = () => {
    let now = Date.now()
    let elapsedSeconds = (now - initTime) / 1000
    let kBPerSecond = ((bytesReceived / 1000) / elapsedSeconds).toFixed(2)
    log.toFile(`=== DONE: ${Math.round(bytesReceived / 1000)}kB - ${elapsedSeconds}s - ${kBPerSecond}kB/s`)
    initTime = now
    bytesReceived = 0
}

module.exports = {
    addBytes,
    startNewCycle
}