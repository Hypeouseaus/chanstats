const socketIO = require('socket.io-client')

//let hostURL = location.hostname
let hostURL = "chanstats.info"
//if (hostURL === "") hostURL = "localhost";

console.log("Initiating socket.io connection with hostURL: ", hostURL)
let socket = socketIO("http://" + hostURL)

socket.on("connect", function() { console.log("client connected to server") })
socket.on("logThis", data => { console.log("Socket log:", data) })

module.exports = socket