module.exports = {
  context: __dirname,
  devtool: "inline-sourcemap",
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + "/dist",
    compress: true,
    port: 9000
  }
};