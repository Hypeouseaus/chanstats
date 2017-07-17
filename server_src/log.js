const fs = require('graceful-fs')
const moment = require('moment')
const io = require("./server")

io.on('connection', function(socket) {
	socket.emit('serverStatus', currentStatus, io.engine.clientsCount)
})

if (!fs.existsSync(__dirname + ("/../build"))) {
	fs.mkdirSync(__dirname + ("/../build"))
}
fs.writeFileSync(__dirname + ("/../build/log.txt"), "")

let currentStatus = "Initializing"

let toUsers = (status) => {
	currentStatus = status;
	io.emit('serverStatus', currentStatus, io.engine.clientsCount)
}

let toFile = (status, consoleOnly = false) => {
	status = moment().format("DD.MM.YY-HH:mm:ss - ") + status
	console.log(status)
	if (!consoleOnly) {
		fs.appendFile(__dirname + ("/../build/log.txt"), status + "\n")
	}
}

module.exports = {
	toUsers,
	toFile
}