let processCatalog = (catalog, board) => {
	let boardResearch = {
		initTime: Date.now(),
		threadList: [],
		activityList: [],
		replies: 0,
		images: 0,
		threadAges: 0,
		newestPostID: 0,
	}
	for (page of catalog) {
		(page.threads).forEach((thread, index, arr) => {
			if (!thread.closed) {
				boardResearch.threadList.push(thread.no);
				(boardResearch.activityList).push({
					no: thread.no,
					postsPerMinute: thread.replies > 50 ? thread.replies / ((Date.now() - thread.tim) / (1000 * 60)) : -1,
					sub: thread.sub || "(no title entered)",
					//com: thread.com ? thread.com.replace(/<br>+/gi, "\n").replace(/&gt;&gt;\d+|<.+?>/gi, "").replace(/&gt;/gi, ">").replace(/&#...;/gi, "").substring(0, 127) : ""
					com: thread.com || "(no text entered)",
					//image: `https://i.4cdn.org/${board}/${thread.tim}s${thread.ext}`
					image: `https://i.4cdn.org/${board}/${thread.tim}s.jpg`
				})
				boardResearch.replies += thread.replies
				boardResearch.images += thread.images
				boardResearch.threadAges += thread.time
				if (thread.last_replies) {
					boardResearch.newestPostID = Math.max(boardResearch.newestPostID, thread.last_replies[thread.last_replies.length - 1].no) //sometimes just checking the first unlocked thread isnt enough
				} else {
					boardResearch.newestPostID = Math.max(boardResearch.newestPostID, thread.no)
				}
			}
		})
	}
	return boardResearch
}

module.exports = processCatalog