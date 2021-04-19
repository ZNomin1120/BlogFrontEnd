const path = require("path");
const fse = require("fs-extra");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./src/img", "./dist/img");
    });
  }
}

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    before: function (src, server) {
      server._watch("./src/**/*.html");
    },
    contentBase: path.join(__dirname, "src"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  },

  entry: "/src/scripts/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new RunAfterCompile(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
