const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|jpg|png|gif|woff|woff2|eot|ttf|pdf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'images',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: 'dist',
    historyApiFallback: true,
  },
  plugins: [new HtmlWebpackPlugin({
    favicon: './assets/favicon.png',
    templateContent:
    `
    <!DOCTYPE html>
    <html>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Snake</title>
      <body>
        <div id="root"></div>
      </body>
    </html> `,
  }),
  new ESLintPlugin({
    extensions: 'jsx',
  })],
}
