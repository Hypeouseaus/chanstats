<template>
	<div id="app">
		<component-header></component-header>
		<component-data></component-data>
		<component-footer></component-footer>
	</div>
</template>

<script>
import componentHeader from "./header.vue"
import componentData from "./data.vue"
import componentFooter from "./footer.vue"

const components = {
	componentHeader,
	componentData,
	componentFooter
}

export default {
	data() {
		return {

		}
	},
	components
}
</script>

<style lang="scss" scoped>
@import "~css/config.scss";
#app {
	z-index: 0;
	position: relative;
	min-height: 100vh;
	background-color: $nord0;
}
</style>