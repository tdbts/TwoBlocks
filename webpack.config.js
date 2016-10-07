var path = require('path'), 
    webpack = require('webpack');
 
module.exports = [

	/*----------  Client (DOM)  ----------*/
	
	{
		entry: {
			index: './build/index.js'
		},
		output: { 
			path: path.join(__dirname, 'dist'), 
			filename: '[name].js' 
		},
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
					test: /\.worker\.js$/, 
					loader: 'worker-loader?inline=true'  // inline must be 'true' in order for the worker loader to, well, work 
				}, 				
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
	  	worker: {
	  		output: {
	  			filename: "twoBlocks.worker.js", 
	  			chunkFileName: "twoBlocks.worker.js"
	  		}
	  	}
	}
];
