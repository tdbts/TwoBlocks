var path = require('path'), 
    webpack = require('webpack');
 
module.exports = {
	entry: './src/index.js',
	output: { path: path.join(__dirname, 'dist'), filename: 'index.js' },
	module: {
		preloaders: [
			{
				test: /\.js$/, 
				loader: 'eslint', 
				include: path.join(__dirname, 'src'), 
			}
		], 
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015']
        		}
      		}
    	]
  	},
};
