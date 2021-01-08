const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        dashboard: [
        	'./public/scripts/dashboard/dashboard.js',
        	'./public/scripts/dashboard/settingsControl.js'
        ],
        login: {
        	import: './public/scripts/login.js',
        	filename: '[name].js'
        },
        signup: { 
        	import: './public/scripts/login.js',
        	filename: '[name].js'
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build/')
    }
}
