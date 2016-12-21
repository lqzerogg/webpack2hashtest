/**
 * Created by Zero on 5/17/16.
 */
'use strict'

let koa = require('koa')
let bodyParser = require('koa-bodyparser')
let gzip = require('koa-gzip')
let session = require('koa-session')
let router = require('./router')
let handlebars = require('koa-hbs')
const config = require('./config')
const app = koa()

process.env.BABEL_ENV = process.env.NODE_ENV = process.env.ENV

app.config = config[process.env.ENV]




app.use(bodyParser())
app.use(session(app))
app.use(gzip())
// app.use(serve({
//     rootDir: __dirname + '/public',
//     rootPath: '/public',
//     gzip: true,
//     maxage: 1000 * 3600 * 24 * 1000
// }))
handlebars.registerHelper('helper.stringify', (obj) => {
    return JSON.stringify(obj)
})
app.use(handlebars.middleware({
    viewPath: __dirname + '/template/views',
    partialsPath: __dirname + '/template/partials',
    disableCache: true,
    extname: '.html'
}))

var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var compiler = webpack(webpackConfig)

app.use(require('koa-webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}))
app.use(require('koa-webpack-hot-middleware')(compiler))


// app.use(function  *(next) {
//     yield next
//     console.log(this.request.url, JSON.stringify(this.request.headers))
// })

app.on('error', function (e) {
    console.error(e)
})

process.on('unhandledRejection', function (reason) {
    console.error(reason)
})

process.on('uncaughtException', function (reason) {
    console.error(reason)
})

router(app)

const port = app.config.port

app.listen(port)

console.log(`listening${port}, live bet has set up`)
