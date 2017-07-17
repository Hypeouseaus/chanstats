<template>
	<div class="component-footer has-text-centered">
		<div class="section">
			<div className="container">
				<h6 className="title is-6">The information above is gathered from the public
					<a href="https://4chan.org">4chan</a> API.</h6>
				<h6 className="subtitle is-6">Read the documentation
					<a href="https://github.com/4chan/4chan-API">here</a>.</h6>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			msg: "Message from data"
		}
	},
	methods: {

	},
	created() {

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

.component-footer>.section {
	font-family: monospace;
	background: transparent;
}

a {
	color: $nord14;
}
</style>