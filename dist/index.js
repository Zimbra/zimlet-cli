#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = run;
exports.configure = configure;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _consoleClear = require('console-clear');

var _consoleClear2 = _interopRequireDefault(_consoleClear);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

var _postcssDiscardComments = require('postcss-discard-comments');

var _postcssDiscardComments2 = _interopRequireDefault(_postcssDiscardComments);

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(args, callback) {

	//if it is just package, then package appropriately
	if (args.package) {
		return packageZimlet(args, callback);
	}

	var config = configure(args);

	var compiler = (0, _webpack2.default)(config);

	compiler.plugin('failed', function (err) {
		console.error(err.stack || err);
		if (err.details) console.error(err.details);
	});

	compiler.plugin('done', function (stats) {
		var info = stats.toJson();

		if (stats.hasErrors()) {
			process.stdout.write(_chalk2.default.red('Build failed!\n\n'));
			info.errors.forEach(function (err) {
				return console.error(err);
			});
		} else {
			(0, _consoleClear2.default)();

			if (stats.hasWarnings()) {
				info.warnings.forEach(function (err) {
					return console.warn(err);
				});
			}

			process.stdout.write(_chalk2.default.green('Compiled successfully!\n\n'));

			if (config.devServer) {
				var _config$devServer = config.devServer,
				    https = _config$devServer.https,
				    host = _config$devServer.host,
				    port = _config$devServer.port;

				var protocol = https ? 'https' : 'http';
				if (host === '0.0.0.0') host = 'localhost';
				var serverAddr = protocol + '://' + host + ':' + _chalk2.default.bold(port) + '/index.js';
				var localIpAddr = protocol + '://' + _ip2.default.address() + ':' + _chalk2.default.bold(port) + '/index.js';

				process.stdout.write('You can view the application in browser.\n\n');
				process.stdout.write(_chalk2.default.bold('Local:') + '            ' + serverAddr + '\n');
				process.stdout.write(_chalk2.default.bold('On Your Network:') + '  ' + localIpAddr + '\n');
			}
		}
	});

	if (config.devServer) {
		new _webpackDevServer2.default(compiler, config.devServer).listen(config.devServer.port);
	} else {
		compiler.run(function (err, stats) {
			if (!err && stats.hasErrors()) {
				err = stats.toJson().errors.length + ' errors';
			}
			callback(err, null);
		});
	}
}

function configure(env) {
	env = env || {};
	var watch = env.watch || env.w || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';
	var PROD = !watch;

	var https = !(process.env.HTTPS === 'false' || env.https === false),
	    host = process.env.HOST || env.host || 'localhost',
	    port = process.env.PORT || env.port || 8081;

	var cwd = process.cwd(),
	    context = cwd,
	    pkg = void 0;

	try {
		pkg = require(_path2.default.resolve(cwd, 'package.json'));
	} catch (e) {}

	if (!pkg) {
		pkg = { main: 'index.js' };
	}

	// entry point (initial file to load)
	var entry = _path2.default.resolve(cwd, pkg.module || pkg['jsnext:main'] || pkg.main);
	if (isDir(entry)) entry = _path2.default.resolve(entry, 'index.js');

	// attempt to use ./src dir if present:
	if (isDir(_path2.default.resolve(cwd, 'src'))) context = _path2.default.resolve(context, 'src');

	// normalize desination dir
	var dest = _path2.default.resolve(cwd, env.dest || 'build');

	// use absolute paths
	context = _path2.default.resolve(context);

	var componentDirs = [_path2.default.resolve(context, 'components'), _path2.default.resolve(context, 'screens'), _path2.default.resolve(context, 'pages')];

	var cssLoaderOptions = {
		autoprefixer: false,
		sourceMap: watch && !PROD
	};

	var postCssLoaderOptions = {
		plugins: [(0, _postcssCssnext2.default)({ browsers: ['last 2 versions', 'ie >= 11', 'iOS >= 8'] }), (0, _postcssDiscardComments2.default)({ removeAll: true })]
	};

	var cssModulesRegexp = (0, _util.crossPlatformPathRegex)(/(?:([^/@]+?)(?:-(?:pages?|components?|screens?))?\/)?src\/(?:pages|components|screens)\/(.+?)(\/[a-z0-9._-]+[.](less|css))?$/);

	var webpackConfig = {
		context: context,
		entry: _path2.default.resolve(__dirname, 'entry.js'),

		output: {
			path: dest,
			filename: 'index.js',
			chunkFilename: '[name].[chunkhash:8].chunk.js',
			// NOTE: Explicit public path is required in order to make HMR work within an sourceless iframe.
			// This is due to a bug in webpack-dev-server that uses the document protocol for all https pages:
			// https://github.com/webpack/webpack-dev-server/blob/c490b245ad65f315762e03e51710f7f7177b1e7b/client/index.js#L188-L190
			publicPath: watch ? 'http' + (https ? 's' : '') + '://' + host + ':' + port + '/' : '/'
		},

		resolve: {
			extensions: ['.jsx', '.js', '.json', '.css', '.less'],
			mainFields: ['browser', 'module', 'jsnext:main', 'main'],
			modules: [_path2.default.resolve(cwd, 'node_modules'), _path2.default.resolve(__dirname, '..', 'node_modules'), _path2.default.resolve(__dirname, '../../..'), // Resolves to the `packages` directory
			'node_modules'],

			alias: {
				preact: _path2.default.resolve(__dirname, 'preact.js'),
				react: 'preact',
				'react-dom': 'preact-compat',
				style: _path2.default.resolve(context, 'style'),
				'zimlet-cli-entrypoint': _path2.default.resolve(context, entry)
			}
		},

		resolveLoader: {
			modules: [_path2.default.resolve(__dirname, 'loaders'), _path2.default.resolve(__dirname, '..', 'node_modules'), _path2.default.resolve(cwd, 'node_modules')]
		},

		module: {
			rules: [{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					comments: false,
					presets: [[require.resolve('babel-preset-env'), { loose: true, modules: false }], require.resolve('babel-preset-stage-0')],
					plugins: [require.resolve('babel-plugin-transform-decorators-legacy'), require.resolve('babel-plugin-transform-object-assign'), [require.resolve('babel-plugin-transform-react-jsx'), { pragma: 'preact.h' }]]
				}
			}, {
				test: /\.(less|css)$/,
				// include: /(^|\/)src\/(?:components|screens)\//,
				include: componentDirs,
				use: [{
					loader: _path2.default.resolve(__dirname, 'zimlet-style-loader.js')
				}, {
					loader: 'css-loader',
					options: _extends({}, cssLoaderOptions, {
						modules: true,
						importLoaders: 1,
						localIdentRegExp: cssModulesRegexp,
						localIdentName: '[1]_[2]_[local]'
					})
				}, {
					loader: 'postcss-loader',
					options: postCssLoaderOptions
				}, {
					loader: 'less-loader'
				}]
			}, {
				test: /\.(less|css)$/,
				// exclude: /(^|\/)src\/(?:components|screens)\//,
				exclude: componentDirs,
				use: [{
					loader: _path2.default.resolve(__dirname, 'zimlet-style-loader.js')
				}, {
					loader: 'css-loader',
					options: cssLoaderOptions
				}, {
					loader: 'postcss-loader',
					options: postCssLoaderOptions
				}, {
					loader: 'less-loader'
				}]
			}, {
				test: /\.(xml|html|txt|md)$/,
				loader: 'raw-loader'
			}, {
				test: /\.(svg|ttf|woff2?|eot|otf|jpe?g|png|gif)$/i,
				loader: watch ? 'url-loader' : 'file-loader'
			}]
		},

		node: PROD ? {
			console: false,
			Buffer: false,
			__filename: false,
			__dirname: false,
			setImmediate: false
		} : {},

		plugins: [].concat(PROD ? [new _webpack2.default.NoEmitOnErrorsPlugin(), new _webpack2.default.HashedModuleIdsPlugin(), new _webpack2.default.optimize.ModuleConcatenationPlugin(), new _webpack2.default.optimize.UglifyJsPlugin()] : [new _webpack2.default.NamedModulesPlugin(), new _webpack2.default.HotModuleReplacementPlugin()], new _webpack2.default.LoaderOptionsPlugin({
			minimize: PROD,
			debug: !PROD
		}), new _progressBarWebpackPlugin2.default({
			format: '\x1B[90m\x1B[44mBuild\x1B[49m\x1B[39m [:bar] \x1B[32m\x1B[1m:percent\x1B[22m\x1B[39m (:elapseds) \x1B[2m:msg\x1B[22m',
			renderThrottle: 100,
			summary: false
		}), new _webpack2.default.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(PROD ? 'production' : 'development')
		})),

		watchOptions: {
			ignored: ['build', dest, _path2.default.resolve(cwd, 'node_modules')]
		},

		stats: 'errors-only',

		devtool: watch ? 'cheap-module-eval-source-map' : 'source-map'
	};

	if (watch) {
		webpackConfig.entry = [webpackConfig.entry, 'webpack-dev-server/client?' + (https ? 'https' : 'http') + '://' + host + ':' + port + '/', 'webpack/hot/dev-server?' + (https ? 'https' : 'http') + '://' + host + ':' + port + '/'];

		webpackConfig.devServer = {
			host: host,
			port: port,
			hot: !process.env.DISABLE_HOT,
			https: https,
			compress: true,
			publicPath: '/',
			contentBase: context,
			disableHostCheck: true,
			before: function before(app) {
				app.use(require('cors')({
					maxAge: 3600
				}));
			},

			watchOptions: {
				ignored: ['build', dest, _path2.default.resolve(cwd, 'node_modules')]
			},
			overlay: false,
			noInfo: true,
			quiet: true,
			stats: 'errors-only'
		};
	}

	return webpackConfig;
}

function packageZimlet(args, callback) {

	// normalize built files source directory and desination package dir
	var cwd = process.cwd();
	var builddir = _path2.default.resolve(cwd, args.builddir || 'build');
	var dest = _path2.default.resolve(cwd, args.dest || 'pkg', args.name + '.zip');

	//Create the xml descriptor file for the zimlet
	var xmlFile = args.name + '.xml';

	var zimletXML = '<zimlet name="' + args.name + '" version="' + args['pkg-version'] + '" description="' + args.description + '">';

	_fs2.default.readdir(builddir, function (err, files) {
		files.forEach(function (file) {
			if (file.match(/\.js$/)) {
				zimletXML += '\n\t<include>' + file + '</include>';
			} else if (file.match(/\.css$/)) {
				zimletXML += '\n\t<includeCSS>' + file + '</includeCSS>';
			} else if (file !== xmlFile) {
				zimletXML += '\n\t<resource>' + file + '</resource>';
			}
		});

		zimletXML += '\n</zimlet>';

		_fs2.default.writeFile(_path2.default.resolve(builddir, xmlFile), zimletXML, function (err) {
			if (err) {
				return callback('Failed to write XML file: ' + err);
			}

			//Zip up the contents of the build dir along with the xml file as the final zimlet deliverable
			var zipFile = new _admZip2.default();
			zipFile.addLocalFolder(builddir, '');
			zipFile.writeZip(dest);

			return callback(null, 'Successfully packaged zimlet to: ' + dest + '\n');
		});
	});
}

function isDir(filepath) {
	try {
		return !!_fs2.default.statSync(filepath).isDirectory();
	} catch (err) {}
}
//# sourceMappingURL=index.js.map