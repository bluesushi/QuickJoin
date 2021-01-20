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
        },
        settings: {
            import: './web/settings.js',
            filename: '[name].js'
        },
        forgotPassword: {
            import: './web/forgotPassword.js',
            filename: '[name].js'
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build/')
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
}
