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
				test: /\.jsx?$/, 
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
					plugins: [
						'syntax-object-rest-spread',
						'transform-es2015-destructuring',
						'transform-object-assign',
						'transform-object-rest-spread'
					], 
					presets: ['es2015', 'react']
        		}
      		}
    	]
  	},
};
