var path = require('path'), 
    webpack = require('webpack');
 
module.exports = {
	entry: './build/index.js',
	output: { path: path.join(__dirname, 'dist'), filename: 'index.js' },
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
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
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					plugins: ['transform-object-assign'], 
					presets: ['es2015', 'react']
        		}
      		}
    	]
  	},
};
