const webpack = require("webpack")

const PurifyCSSPlugin = require('purifycss-webpack')
const BabiliPlugin = require("babili-webpack-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')
const glob = require('glob')

module.exports = {
	plugins: [

		new PurifyCSSPlugin({
			styleExtensions: [".css", ".sass", ".scss"],
			paths: glob.sync(path.join(__dirname, '/src/{*.html,components/*.vue,js/**/*.vue}')),
			//paths: glob.sync(path.join(__dirname, '/build/*.js')),
			verbose: true
		}),
		new OptimizeCssAssetsPlugin(),
		//new webpack.optimize.UglifyJsPlugin({
		//sourceMap: false
		//})
		new BabiliPlugin()
	]
}