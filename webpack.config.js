

var path = require('path');

module.exports = {
    mode: "development",
    // devServer: { inline: true },
    devServer: {
        contentBase: [
            path.resolve("app/"),
        ],
    },

    entry: {
        index: './js/app.js',
    },
    devtool: 'source-map',
    output: {
        path: path.resolve("app/"),
        filename: 'bundle.js'
    },


    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.exec\.js$/,
                use: ['script-loader']
            }
        ]
    },

}