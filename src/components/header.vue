<template>
	<div class="component-intro has-text-centered">
		<div class="section">
			<h3 class="title is-3 chan-stats">Some chan stats</h3>
			<br>
			<p class="comment">
				This page keeps updating, as the server continuously checks the catalog of certain boards.
				<br> A full update cycle takes a little while, as the server only queries ~1 thread per second, in line with the API rules.
				<br> "posts/user" and "post length" are taken from the first 3 pages of each board.
			</p>
			<br>
			<h6 class="server-status title is-6">Server status: {{serverStatus}}</h6>
		</div>
		<h6 class="connected">{{clientCount}}</h6>
	</div>
</template>

<script>
export default {
	data() {
		return {
			serverStatus: "Connecting...",
			clientCount: 0
		}
	},
	methods: {

	},
	created() {
		let socket = require("../js/socket.js")

		socket.on('serverStatus', (statusMsg, clientCount) => {
			this.serverStatus = statusMsg
			this.clientCount = clientCount
		})
	},
	mounted() {

	}
}
</script>

<style scoped lang="scss">
@import "~css/config";
* {
	color: #f1f1f1;
}

.component-intro>.section {
	font-family: monospace;
	background: transparent;
}

.connected {
	position: absolute;
	top: 4px;
	left: 4px;
	font-size: 12px;
	color: $nord6;
	opacity: 0.25;
}

.comment {
	font-size: 0.875rem;
}
</style>