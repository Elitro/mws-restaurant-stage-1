var HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
  mode: 'development',
  // entry: [
  //   // './src/index'
  // ],
  entry: {
    main: [
      // './src/js/main.js',
      './src/index.js',
      './src/css/styles.scss'
    ],
    restaurantInfo: [
      // './src/js/restaurant_info.js',
      './src/restaurantIndex.js',
      './src/css/styles.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['main'],
      template: './index.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['restaurantInfo'],
      template: './restaurant.html',
      filename: 'restaurant.html'
    }),
    // Copy static assets
    new CopyWebpackPlugin([
      {
        from: 'data',
        to: 'data'
      },
      {
        from: 'img',
        to: 'img'
      }
    ])
  ]
}
