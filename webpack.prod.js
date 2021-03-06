const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'babel-loader' },
      { test: /\.(png|svg|jpg|gif)$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.ejs',
      filename: '../static/index.html',
      inlineSource: '.(js|css)$',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new HtmlWebpackHarddiskPlugin()
  ]
};
