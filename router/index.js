/**
 * Created by Zero on 5/17/16.
 */
'use strict'
let Router = require('koa-router')
let _app = require('./controllers/app')

module.exports = function(app) {
    var router = new Router()
    
    router.get('*', _app.index)

    app.use(router.middleware())
}

