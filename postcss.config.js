
// const configSuitcss = require('stylelint-config-suitcss')
module.exports = {
    plugins: {
        'postcss-smart-import': {},
        // 'stylelint': configSuitcss,
        'postcss-will-change': {},
        'postcss-vmin': {},
        'precss': {},
        'postcss-cssnext': {
            browsers: ['last 2 versions', '> 2%']
        },
        'lost': {},
        'postcss-pxtorem': {},
        'cssnano': {
            reduceIdents: { keyframes: false },
            discardUnused: false
        },
        'postcss-color-function': {}

    }
    // plugins: [
        // _imports({}),
        // stylelint(configSuitcss),
        // willChange,
        // vmin,
        // precss,
        // cssnext,
        // autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
        // lost,
        // bem,
        // nested,
        // pxtorem,
        // cssnano({reduceIdents: { keyframes: false }, discardUnused: false}),
        // colorFunction
    // ]
}