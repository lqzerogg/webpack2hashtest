/**
 * Created by Zero on 5/17/16.
 */


// Modules
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
// let HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')


/**
 * Make webpack config
 * @param {Object} options Builder options
 * @param {boolean} options.TEST Generate a test config
 * @param {boolean} options.BUILD Generate a build config
 * @returns {Object} Webpack configuration object
 */
module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    const BUILD = !!options.BUILD
    const TEST = !!options.TEST
    const DEV = !!options.DEV
    const ADJUST = !!options.ADJUST

    const DEV_PORT = 3200
    const PATH = {
        src: path.join(__dirname, 'feSRC'),
        build: path.join(__dirname, 'public'),
        templates: path.join(__dirname, 'template'),
        node_modules: path.join(__dirname, 'node_modules')
    }

    //alia used in path
    const ALIAS = {
        '@data': path.join(PATH.src, 'data'),
        '@view': path.join(PATH.src, 'view'),
        '@util' : path.join(PATH.src, 'util')
    }

    /**
     * new page should be added here
     * @type {string[]}
     */

    const PAGES = ['app']

    // /**
    //  * Environment values
    //  */
    // var NODE_ENV = process.env.NODE_ENV || 'dev'

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let common = {
        entry: {},
        output: {},
        plugins: [],
        bail: true
        // ,
        // context: __dirname
    }
    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    common = merge(common, parts.commonLoaders(PATH.src))

    const localIdentName = BUILD
        ? '[hash:base64]'
        : '[path][name]---[local]---[hash:base64:5]'

    if (!TEST) {
        let entry = {
            // 'css/base': path.join(PATH.src, 'view/cssBase/base/index.scss')
        }
        PAGES.forEach((page) => {
            entry[`js/${page}`] = ['babel-polyfill', 'whatwg-fetch', path.join(PATH.src, `view/pages/${page}/index.js`)]
            entry[`css/${page}`] = path.join(PATH.src, `view/pages/${page}/index.scss`)
            if(DEV) {
                entry[`js/${page}`].push('webpack-hot-middleware/client')
            }
        })
    
        common = merge(common,
            {
                entry: entry,
    
                resolve: {
                    extensions: ['.js', '.jsx', 'css', 'scss'],
                    alias: ALIAS
                },
    
                output: {
                    // Absolute output directory
                    path: PATH.build,
    
                    // Output path from the view of the page
                    // Uses webpack-dev-server in development
                    publicPath: options.publicPath,
    
                    // Filename for entRy points
                    // Only adds hash in build mode
                    filename: BUILD || ADJUST ? '[name].[chunkhash].js' : '[name].bundle.js',
    
                    // Filename for non-entry points
                    // Only adds hash in build mode
                    chunkFilename: BUILD || ADJUST ? 'js/[name].[chunkhash].js' : 'js/[name].bundle.js'
                }
            },
            parts.extractBundle({
                name: 'js/vendor',
                entries: [
                    'clone', 'whatwg-fetch', 'classnames', 'redux-thunk', 'react-hammerjs', 'hammerjs', 'moment',
                    'normalizr', 'react', 'react-event-listener', 'react-router', 'react-dom', 'babel-polyfill', 'redux',
                    'react-redux', 'immutable', 'humps', 'formsy-react', 'autotrack'
                ]
            })
        )
    }

    //for production
    if (BUILD) {
        common = merge(
            common,
            {
                devtool: 'source-map'
            },
            parts.clean(PATH.build),
            parts.minify(),
            // parts.eslint(PATH.src, './.onlineeslintrc.json'),
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName
            }, false, webpack),
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.webpack2Option(),
            parts.statsFile(path.join(PATH.templates, 'stats.json'))
        )
    }

    //for adjust
    if (ADJUST) {
        common = merge(
            common,
            {
                devtool: 'eval-source-map'
            },
            parts.clean(PATH.build),
            // parts.eslint(PATH.src, './.onlineeslintrc.json'),
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName
            }, true, webpack),
            parts.webpack2Option(),
            parts.statsFile(path.join(PATH.templates, 'stats.json'))
        )
    }

    //for developing
    if (DEV) {
        common = merge(
            common,
            {
                devtool: 'eval-source-map'
            },
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName

            }, true, webpack),
            parts.webpack2Option(),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.port || DEV_PORT
            })
        )
    }


    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (TEST) {
        common = merge(
            common,
            parts.webpack2Option(),
            {
                resolve: {
                    extensions: ['.js', '.jsx', 'css', 'scss'],
                    alias: ALIAS
                },
                module: {
                    rules: [{
                        test: /\.js$/,
                        enforce: 'pre',
                        exclude: [
                            /node_modules/,
                            /\.test\.js$/
                        ],
                        loader: 'isparta-loader'
                    }]
                },
                // preLoaders: [
                //     {
                //         test: /\.js$/,
                //         exclude: [
                //             /node_modules/,
                //             /\.test\.js$/
                //         ],
                //         loader: 'isparta-instrumenter'
                //     }
                // ],
                output: {}
                ,
                devtool: 'inline-source-map'
            }
        )
    }

    return common
}
