/**
 * Created by Zero on 5/17/16.
 * @desc home page controller
 */

'use strict'

const path = require('path')
const fs = require('fs')

function _readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, res) => {
            if(err) {
                reject(err)
                throw err
            } else {
                resolve(res)
            }

        })
    })
}
module.exports = {
    commonData: function (name) {
        let jsonPromise = _readFile(path.join(__dirname, './json/common.json'))
        let viewPromise = _readFile(path.join(__dirname, `./json/${name}.json`))

        return Promise.all([jsonPromise, viewPromise]).then((arr) => {
            let commonData = JSON.parse(arr[0])

            let data = JSON.parse(arr[1])
            Object.assign(data, commonData)
            // data.stringLanguage = new Buffer(JSON.stringify(data.language)).toString('base64')
            // data.stringUInfo = new Buffer(JSON.stringify(data.uInfo)).toString('base64')
            // data.stringText = new Buffer(JSON.stringify(data.text)).toString('base64')
            // data.stringGames = new Buffer(JSON.stringify(data.games)).toString('base64')
            data.stringLanguage = encodeURIComponent(JSON.stringify(data.language))
            data.stringUInfo = encodeURIComponent(JSON.stringify(data.uInfo))
            data.stringText = encodeURIComponent(JSON.stringify(data.text))
            data.stringGames = encodeURIComponent(JSON.stringify(data.games))
            return data
        })
    },
    jsonData: function (name) {
        return _readFile(path.join(__dirname, `./json/${name}.json`)).then((str) => {
            return JSON.parse(str)
        })
    },
    tplData: function (name, lang = 'en') {
        return _readFile(path.join(__dirname, `../../template/static_pages/${lang}/${name}.html`))
    }
}
