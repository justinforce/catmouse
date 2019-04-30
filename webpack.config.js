const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { NODE_ENV } = require('./env')

module.exports = {
  devServer: {
    hot: true,
    overlay: true,
  },
  // spell-checker: ignore devtool
  devtool: 'source-maps',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          ...{
            development: ['react-hot-loader/webpack'],
            production: [],
            test: [],
          }[NODE_ENV],
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['image-webpack-loader', 'file-loader'],
      },
      {
        test: /\.svg$/,
        use: 'svg-react-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'src/images/Favicon.png',
      meta: {
        viewport: [
          'initial-scale=1',
          'minimum-scale=1',
          'shrink-to-fit=no',
          'width=device-width',
        ].join(', '),
      },
    }),
    ...{
      development: [new HotModuleReplacementPlugin()],
      production: [],
      test: [],
    }[NODE_ENV],
  ],
  resolve: {
    development: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    production: {},
    test: {},
  }[NODE_ENV],
}
