<template>
	<div class="component-data has-text-centered">
		<div class="section">
			<div class="container">
				<div class="columns is-multiline">
					<div class="column is-12-tablet is-6-desktop">
						<h4 class="title is-4 headline">Board Statistics</h4>
						<table class="table is-striped">
							<thead>
								<tr>
									<td @click="sortEm('name')" class="td-board">
										Board{{sortBy == 'name'? '⮃' : ''}}
										<td @click="sortEm('postsPerMinute')">
											{{sortBy == 'postsPerMinute'? '⮃' : ''}}Posts/min
										</td>
										<td @click="sortEm('threadsPerHour')">{{sortBy == 'threadsPerHour'? '⮃' : ''}}Threads/hour</td>
										<td @click="sortEm('imagesPerReply')">{{sortBy == 'imagesPerReply'? '⮃' : ''}}Images</td>
										<td @click="sortEm('postsPerUser')" class="is-hidden-mobile">{{sortBy == 'postsPerUser'? '⮃' : ''}}Posts/user</td>
										<td @click="sortEm('charsPerPost')" class="is-hidden-mobile">{{sortBy == 'charsPerPost'? '⮃' : ''}}Postlength</td>
								</tr>
							</thead>
							<transition-group name="flip-list" tag="tbody">
	
								<tr v-for="board in boardStatsNew" :key="board.name" @click="showThreadsFor = board.name" v-if="board.postsPerMinute" :class="{tableHighlight : (showThreadsFor == board.name)}">
									<td class="td-board">/{{board.name}}/</td>
									<td>{{board.postsPerMinute.toFixed(2)}}</td>
									<td>{{board.threadsPerHour.toFixed(2)}}</td>
									<td>{{Math.round(board.imagesPerReply * 100)}}%</td>
									<td class="is-hidden-mobile">{{board.postsPerUser.toFixed(2)}}</td>
									<td class="is-hidden-mobile">{{board.charsPerPost.toFixed(2)}}</td>
								</tr>
	
							</transition-group>
						</table>
					</div>
					<div class="column is-12-tablet is-6-desktop">
						<h4 class="title is-4 headline">Active threads on /{{showThreadsFor}}/</h4>
						<div class="popular-threads" v-if="boardStatsNew.length > 0">
							<a class="" v-for="(thread,index) in boardStatsNew.find((el)=>{return el.name == showThreadsFor}).popularThreads" :key="index" :href="`https://boards.4chan.org/${showThreadsFor}/thread/${thread.no}`" target="_blank">
								<div class="img-wrapper">
									<img :src="thread.image" referrerpolicy="no-referrer" ref="img">
								</div>
								<div class="text-wrapper has-text-left ">
									<h6 class="subtitle is-6">{{thread.postsPerMinute.toFixed(2)}} posts/min</h6>
									<h6 class="title is-6 thread-title" v-html="thread.sub"></h6>
									<p class="subtitle is-6" v-html="thread.com"></p>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showThreadsFor: "a",
			sortBy: "UNINITIALIZED",
			boardStatsNew: []
		}
	},
	methods: {
		sortEm: function (sortBy) {
			if (sortBy == this.sortBy) {
				this.boardStatsNew.reverse()
				return;
			}
			this.sortBy = sortBy;
			if (sortBy == "name") {
				this.boardStatsNew.sort((a, b) => {
					if (a.name < b.name) return -1
					if (a.name > b.name) return 1
					return 0;
				})
			} else {
				this.boardStatsNew.sort((a, b) => {
					return b[sortBy] - a[sortBy]
				})
			}
		}
	},
	created() {
		let socket = require("../js/socket.js")

		socket.on('chanStats', (data) => {
			for (let board in data) {
				let boardInfo = data[board]
				boardInfo.name = board

				this.boardStatsNew.push(boardInfo)
			}
			this.sortEm("name")
		})

		socket.on('boardUpdate', (board, data) => {
			let index = this.boardStatsNew.findIndex((el) => {
				return el.name == board
			})
			data.name = board
			this.$set(this.boardStatsNew, index, data)
		})
	},
	mounted() {

	},
	watch: {
		boardStats: function () {
			console.log("up")
			console.log(this.$refs)
		}
	}
}
</script>

<style scoped lang="scss">
@import "~css/config";

.component-data>.section {
	font-family: monospace;
	background: transparent;
}

.headline {
	color: $nord0;
	background: $nord6;
	padding: 0.5rem;
	box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
}

.table {
	box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75);
	table-layout: fixed;
}

thead>tr>td {
	color: #111;
	font-weight: bolder;
}

tbody>tr {
	cursor: pointer;
	font-size: 1rem;
}

.td-board {
	font-weight: bolder;
	text-align: left;
	width: 64px;
	white-space: nowrap;
}

td {
	text-align: right;
	max-width: 100%;
	vertical-align: middle;
}

.tableHighlight {
	background-color: $nord9 !important;
	color: #111;
}

.popular-threads {
	margin-top: 0;
	margin-bottom: 8px;
	background: #fafafa;
	box-shadow: 0px 8px 24px -4px rgba(0, 0, 0, 0.75); //margin: 0 0 8px;
}

a {
	position: relative;
	display: flex;
	height: 140px;
	background: #fafafa;
	background: $nord6;
}

.popular-threads>a:not(:last-of-type) {
	border-bottom: 1px solid $nord0;
}

a>.img-wrapper {
	padding: 0;
	width: 250px;
	height: 140px;
	max-width: 20vw;
	max-height: 20vw;
	flex: 0 0 250px;
}

img {
	position: relative;
	width: 250px;
	height: 140px;
	max-width: 20vw;
	max-height: 20vw;

	object-fit: cover;
	object-position: center center;
	overflow: hidden;
}

.text-wrapper {
	padding: 0.5rem;
	overflow: hidden;
}

.thread-title {
	font-weight: bolder;
}

.text-wrapper>p {
	font-size: 0.75rem;
	color: #444;
}

.text-wrapper>* {
	margin: 0 0 !important;
}

.flip-list-move {
	transition: transform 0.25s;
}
</style>