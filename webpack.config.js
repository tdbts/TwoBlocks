var fs = require('fs'), 
	path = require('path'), 
    webpack = require('webpack');
 
// Need to add dependencies from 'node_modules' directory 
// to 'externals' array so that Webpack can be used for 
// server-side Node.js code as well. 
var nodeModules = {}; 
 
fs.readdirSync('node_modules')
	
	.filter(function (x) {
		return ['.bin'].indexOf(x) === -1; 
	})
	
	.forEach(function (mod) {
		nodeModules[mod] = 'commonjs ' + mod; 
	}); 
global.console.log("process.env.NODE_ENV:", process.env.NODE_ENV); 
var plugins = []; 

plugins.push(new webpack.DefinePlugin({

	'process.env': {
  		'NODE_ENV': JSON.stringify(process.env.NODE_ENV === 'production' ? 'production' : 'development')
	}
	
}));

if (process.env.NODE_ENV === 'production') {

  	plugins.push(new webpack.optimize.UglifyJsPlugin()); 

  	plugins.push(new webpack.optimize.DedupePlugin()); 

}

var alias = {}; 

if (process.env.NODE_ENV === 'production') {

	alias["react"] = path.join(__dirname, "node_modules/react/dist/react.min.js"); 
	alias["react-dom"] = path.join(__dirname, "node_modules/react-dom/dist/react-dom.min.js"); 
	alias["redux"] = path.join(__dirname, "node_modules/redux/dist/redux.min.js")

}

module.exports = [

	/*----------  Client (DOM)  ----------*/
	
	{
		entry: {
			index: './build/index.js'
		},
		devtool: 'cheap-module-source-map',  
		output: { 
			path: path.join(__dirname, 'dist'), 
			filename: '[name].js' 
		}, 
		resolve: {
			extensions: ['', '.js', '.jsx'], 
			alias: alias
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
	      		}, 
	      		{ 
	      			test: /\.css$/, 
	      			loader: "style-loader!css-loader" 
	      		}
	    	]
	  	}, 
	  	plugins: plugins, 
	  	worker: {
	  		output: {
	  			filename: "twoBlocks.worker.js", 
	  			chunkFileName: "twoBlocks.worker.js"
	  		}
	  	}
	}, 

	/*----------  Server  ----------*/
	
	{
		entry: {
			server: './src/server/server.js'
		}, 
		output: {
			path: path.join(__dirname, 'dist'), 
			filename: '[name].js'
		}, 
		target: 'node',
		externals: nodeModules,  
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
	} 

];
