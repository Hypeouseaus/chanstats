const axios = require("axios").create({
	timeout: 5000,
	headers: {
		'Accept-Encoding': 'gzip'
	}
});

axios.interceptors.response.use(function(response) {
	bandwidthMonitor.addBytes(parseInt(response.headers["content-length"]))
	return response;
}, function(error) {
	return Promise.reject(error);
});

const io = require("./server_src/server")

io.on('connection', function(socket) {
	socket.emit('chanStats', allBoardStatsDB.value())
})

//const config = require("./server_src/config")
const log = require("./server_src/log")
const bandwidthMonitor = require("./server_src/bandwidthMonitor")
const processCatalog = require("./server_src/processCatalog")
const processThreads = require("./server_src/processThreads")
const calculateResult = require("./server_src/calculateResult")

const lowdb = require('lowdb')
const allBoardStatsDB = lowdb('DB_boardStats.json', {
	storage: require('lowdb/lib/storages/file-async')
})

// CONFIG //
const boardsToCheck = ["a", "b", "co", "fit", "g", "his", "int", "k", "lit", "mu", "pol", "r9k", "sp", "tv", "v", "vg", "x"]
//const boardsToCheck = ["pol", "x"]
const pagesToCheck = 3
// CONFIG //

// MAIN CODE //

const gatherStats = async() => {
	bandwidthMonitor.startNewCycle()

	for (let board of boardsToCheck) {
		log.toUsers(`Fetching catalog of /${board}/`)
		log.toFile(`Fetching catalog of /${board}/`, true)
		await new Promise(resolve => setTimeout(resolve, 1000))
		try {
			let response = await axios.get(`http://a.4cdn.org/${board}/catalog.json`)
			if (response.status == 200) {
				let boardResearch = processCatalog(response.data, board)
				let threadResearch = await processThreads(response.data, board, pagesToCheck)

				let averagedResult = calculateResult(boardResearch, threadResearch, board)
				allBoardStatsDB.set(board, averagedResult).write()
				io.emit('boardUpdate', board, averagedResult)
			}
		} catch (e) {
			log.toFile("ERROR: " + e.message)
		}
	}
	gatherStats()
}

gatherStats()