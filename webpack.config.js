/**
 * Created by Zero on 5/17/16.
 */

/**
 * Webpack config for development
 */


module.exports = require('./webpack.make')({
    BUILD: false,
    TEST: false,
    DEV: true,
    publicPath: '/public/'
})

