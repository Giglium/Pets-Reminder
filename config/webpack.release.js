const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const CordovaHtmlOutputPlugin = require('../webpack/plugins/CordovaHtmlOutputPlugin.js')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const path = require('path')

module.exports = function () {
  return webpackMerge(commonConfig({ mode: 'production' }), {
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new CordovaHtmlOutputPlugin(),
      new TerserPlugin({
        extractComments: false
      }),
      new CleanWebpackPlugin({
        root: path.join(__dirname, '.'),
        dry: false,
        verbose: false,
        exclude: ['index.html'],
        cleanAfterEveryBuildPatterns: ['www']
      })
    ]
  })
}
