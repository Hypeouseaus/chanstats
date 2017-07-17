const _ = require("lodash")
const lowdb = require('lowdb')
let researchDB = lowdb('DB_research.json', {
	storage: require('lowdb/lib/storages/file-async')
})
const boardSpecific = require("./boardSpecific/boardSpecific")

class ResultClass {
	constructor() {
		this.postsPerMinute = 0
		this.threadsPerHour = 0
		this.imagesPerReply = 0
		this.postsPerUser = 0
		this.charsPerPost = 0
		this.averageThreadAgeHours = 0
	}
}

// CONFIG //
let historyLength = 3
// CONFIG //

let summarize = (averagedResult, fromThis, key, divideBy) => {
	if (typeof(fromThis[key]) == "number") {
		if (!averagedResult[key]) {
			averagedResult[key] = 0
		}
		averagedResult[key] += fromThis[key] / divideBy
	}
	if (typeof(fromThis[key]) == "object") {
		if (!averagedResult[key]) {
			averagedResult[key] = {}
		}
		for (let subKey in fromThis[key]) {
			summarize(averagedResult[key], fromThis[key], subKey, divideBy)
		}
	}
}

let calculateResult = (boardResearch, threadResearch, board) => {

	detailThreadAvg = {}
	for (let thread in threadResearch) {
		for (let key in threadResearch[thread]) {
			summarize(detailThreadAvg, threadResearch[thread], key, Object.keys(threadResearch).length)
		}
	}

	let savedResearch = researchDB.get(board, {
		prevInitTime: 0,
		prevNewestPostID: 0,
		prevThreadList: [],
		results: []
	}).value()

	let newThreads = savedResearch.prevThreadList.reduce((acc, val) => {
		return acc + !boardResearch.threadList.includes(val)
	}, 0)

	//hottest threads
	boardResearch.activityList.sort((a, b) => {
		return b.postsPerMinute - a.postsPerMinute
	})

	let newResult = {}
	newResult.postsPerMinute = ((boardResearch.newestPostID - savedResearch.prevNewestPostID) / ((boardResearch.initTime - savedResearch.prevInitTime) / 60000))
	newResult.threadsPerHour = (newThreads / ((boardResearch.initTime - savedResearch.prevInitTime) / 3600000))
	newResult.imagesPerReply = boardResearch.images / boardResearch.replies
	newResult.postsPerUser = detailThreadAvg.posts / detailThreadAvg.uniqueIPs
	newResult.charsPerPost = detailThreadAvg.chars / detailThreadAvg.posts
	newResult.averageThreadAgeHours = (((boardResearch.initTime / 1000) - (boardResearch.threadAges / boardResearch.threadList.length)) / 3600)

	if (Object.keys(boardSpecific).includes(board)) {
		//newResult.boardSpecific = boardSpecific[board].result(boardResearch, threadResearch)
	}

	if (savedResearch.prevInitTime != 0) {
		savedResearch.results.push(newResult)
	}

	savedResearch.prevInitTime = boardResearch.initTime
	savedResearch.prevNewestPostID = boardResearch.newestPostID
	savedResearch.prevThreadList = boardResearch.threadList

	while (savedResearch.results.length > historyLength) {
		savedResearch.results.shift()
	}
	researchDB.set(board, savedResearch).write()

	averagedResult = {}
	for (let result of savedResearch.results) {
		for (let key in result) {
			summarize(averagedResult, result, key, savedResearch.results.length)
		}
	}
	averagedResult.popularThreads = boardResearch.activityList.slice(0, 5)
	/*
	averagedResult.postsPerMinute = averagedResult.postsPerMinute.toFixed(2)
	averagedResult.threadsPerHour = averagedResult.threadsPerHour.toFixed(2)
	averagedResult.imagesPerReply = Math.round(averagedResult.imagesPerReply * 100)
	averagedResult.postsPerUser = averagedResult.postsPerUser.toFixed(2)
	averagedResult.charsPerPost = averagedResult.charsPerPost.toFixed(2)
	
	<td>{{board.postsPerMinute.toFixed(2)}}</td>
	<td>{{board.threadsPerHour.toFixed(2)}}</td>
	<td>{{Math.round(board.imagesPerReply * 100)}}%</td>
	<td>{{board.postsPerUser.toFixed(2)}}</td>
	<td>{{board.charsPerPost.toFixed(2)}}</td>
	*/

	averagedResult.popularThreads.forEach((val, index, arr) => {
		val.sub = val.sub.replace(/<.+?>/gi, "")
		//val.com = val.com.split("<br>", 15).join("\n")
		//val.com = val.com.replace(/<wbr>/gi, "").replace(/&gt;/gi, ">").replace(/&#...;/gi, "*").substring(0, 127)
		//val.com = _.unescape(val.com).replace(/<.+>/gi, "").replace(/&#039;?/gi, "'").substring(0, 512).replace(/\s*\n+/gi, "<br>")
		val.com = val.com.replace(/(<br>)+/gi, "<br>").replace(/<(?!br).+?>/gi, "")
	})
	/*
	for (let i = 0; i < 5; i++) {
		let thread = boardResearch.activityList[i]
		console.log(thread.postsPerMinute.toFixed(1))
		console.log(thread.sub)
		console.log(thread.com)
		console.log("=== === === ===")
	}
	*/

	return averagedResult
}

module.exports = calculateResult