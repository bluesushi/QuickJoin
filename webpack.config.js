const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        dashboard: [
        	'./web/dashboard/dashboard.js',
        	'./web/dashboard/settingsControl.js'
        ],
        login: {
        	import: './web/login.js',
        	filename: '[name].js'
        },
        signup: { 
        	import: './web/login.js',
        	filename: '[name].js'
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build/')
    }
}
