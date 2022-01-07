const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const sharedConfig = require('../webpack.shared.config');

module.exports = {
	...sharedConfig,

	entry: './server.ts',

	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'server.js'
	},

	target: 'node',

	externals: [nodeExternals({
		additionalModuleDirs: ['../node_modules']
	})],

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s?css$/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: 'assets/imgs'
					}
				}
			},
			{
				test: /\.glb$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: 'assets/models'
					}
				}
			}
		]
	},

	plugins: [
		new MiniCSSExtractPlugin({ filename: 'style.css' })
	]
};