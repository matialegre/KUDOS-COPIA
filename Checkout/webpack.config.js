const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    
    mode: "production",

    module: {

        rules: [

            { 
                test: /app.css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader'],
            },

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }

        ]

    },

    optimization: {

        minimize: true,
        minimizer: [
            new CssMinimizerPlugin()
        ]

    },

    plugins: [

        new MiniCssExtractPlugin({
            filename: 'checkout6-custom.css',
            ignoreOrder: false
        })

    ],

    entry: './app.js',

    output: {
        clean: true,
        filename: 'checkout6-custom.js',
        path: path.resolve(__dirname, 'dist'),
    },

};