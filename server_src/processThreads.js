const boardSpecific = require("./boardSpecific/boardSpecific")
const log = require("./log")
const bandwidthMonitor = require("./bandwidthMonitor")
const lowdb = require('lowdb')
const cacheDB = lowdb('DB_threadCache.json', {
	storage: require('lowdb/lib/storages/file-async')
})
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

let processThreads = async(catalog, board, pages) => {
	let isSpecificBoard = Object.keys(boardSpecific).includes(board)
	let dontPrune = []
	let threadCache = cacheDB.get(board, {}).value()
	let threadsToCheck = catalog[0].threads.length * pages
	let threadsChecked = 0
	for (let i = 0; i < pages; i++) {
		for (let catalogThread of catalog[i].threads) {
			//if (threadsChecked >= 3) break
			try {
				threadsChecked++
				if (!catalogThread.closed) {
					dontPrune.push(catalogThread.no)
					let threadResearch = threadCache[catalogThread.no] || {}
					if (threadResearch["last_modified"] == catalogThread["last_modified"]) {
						//log.toFile(`Thread #${catalogThread.no} valid in cache`, true)
						await new Promise(resolve => setTimeout(resolve, 25))
					} else {
						log.toUsers(`Processing /${board}/ threads ${Math.round((threadsChecked / threadsToCheck) * 100)}%`)
						//log.toFile(`Thread #${catalogThread.no} has to be fetched`, true)
						await new Promise(resolve => setTimeout(resolve, 1000))
						let response = await axios.get(`http://a.4cdn.org/${board}/thread/${catalogThread.no}.json`)
						if (response.status == 200) {
							threadResearch.posts = response.data.posts.length
							threadResearch.uniqueIPs = response.data.posts[0].unique_ips
							threadResearch.chars = (response.data.posts).reduce((acc, post) => {
								if (post.com) {
									// remove quotes, html tags
									// replace linebreaks and special chars
									return acc + (post.com).replace(/<br>|<wbr>/gi, " ").replace(/&gt;&gt;\d+|<.+?>/gi, "").replace(/&quot;|&#...;|&gt;/gi, "_").length
								} else {
									return acc
								}
							}, 0)
							if (catalogThread.replies > 50) {
								threadResearch.postsPerMinute = (Date.now() - catalogThread.tim) / (1000 * 60) / catalogThread.replies
							} else {
								threadResearch.postsPerMinute = -1
							}
							if (isSpecificBoard) {
								threadResearch.boardSpecific = boardSpecific.pol.research(response.data)
							}

							threadCache[catalogThread.no] = {
								posts: threadResearch.posts,
								uniqueIPs: threadResearch.uniqueIPs,
								chars: threadResearch.chars,
								postsPerMinute: threadResearch.postsPerMinute,
								last_modified: catalogThread["last_modified"],
								boardSpecific: threadResearch.boardSpecific,
							}
						}
					}

					/*
					let addObject = (boardResearch, threadResearch, key) => {
					    if (typeof(threadResearch[key]) == "number") {
					        if (!boardResearch[key]) {
					            boardResearch[key] = 0
					        }
					        boardResearch[key] += threadResearch[key]
					    }
					    if (typeof(threadResearch[key]) == "object") {
					        if (!boardResearch[key]) {
					            boardResearch[key] = {}
					        }
					        for (let subKey in threadResearch[key]) {
					            addObject(boardResearch[key], threadResearch[key], subKey)
					        }
					    }
					}

					for (let key in threadResearch) {
					    addObject(boardResearch, threadResearch, key)
					}
					*/
				}
			} catch (e) {
				log.toFile("ERROR: " + e.message)
			}
		}
	}

	// Prune thread cache
	for (let threadID in threadCache) {
		if (!dontPrune.includes(parseInt(threadID))) {
			delete threadCache[threadID]
		}
	}
	cacheDB.set(board, threadCache).write()

	return threadCache
}

module.exports = processThreads