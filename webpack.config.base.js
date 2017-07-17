const webpack = require("webpack")

const path = require('path')
//const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

//const front-matter = null;

module.exports = {
	entry: {
		app: 'js/main.js'
		//vendor: ['socket.io-client']
	},
	output: {
		filename: '[name]_[chunkhash:8].js',
		path: path.resolve(__dirname, 'build')
	},
	/*
	watch: true,
	watchOptions: {
		ignored: path.resolve(__dirname, 'node_modules'),
		aggregateTimeout: 300
	},
	*/
	module: {
		rules: [{
				test: /\.md$/,
				//use: ['json-loader', 'yaml-frontmatter-loader']
				use: ['json-loader', 'front-matter']
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader'],
					allChunks: true
				})
			},
			{
				test: /\.(sass|scss)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
					allChunks: true
				})
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				loader: "url-loader?limit=5120&name=fonts/[name]_[hash:8].[ext]"
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: "url-loader?limit=5120&name=img/[name]_[hash:8].[ext]"
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader'
				}]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						css: ExtractTextPlugin.extract({
							use: ['css-loader', 'sass-loader'],
							fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
						}),
						scss: ExtractTextPlugin.extract({
							use: ['css-loader', 'sass-loader'],
							fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
						})
					}
				}
			}
		]
	},
	resolve: {
		alias: {
			//"vue$": 'vue/dist/vue.esm.js',
			//"vue-router$": 'vue-router/dist/vue-router.esm.js'
		},
		modules: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'node_modules')
		]
	},
	plugins: [
		//new webpack.optimize.ModuleConcatenationPlugin(),
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: false,
			dry: false,
			watch: false
		}),

		new webpack.EnvironmentPlugin(['NODE_ENV']),

		new webpack.optimize.CommonsChunkPlugin({
			minChunks: 2,
			children: true,
			async: true
		}),

		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: 'body'
		}),
		//new CopyWebpackPlugin([{ from: 'src/admin/*', to: 'admin/[name].[ext]' }]),
		new ExtractTextPlugin({
			filename: "[name]_[contenthash:8].css",
			disable: false,
			allChunks: true
		})
	]
}