const path = require('path')

module.exports = {
    mode: 'development',
    entry: [
        './public/scripts/dashboard/dashboard.js',
        './public/scripts/dashboard/settingsControl.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build/')
    }
}
