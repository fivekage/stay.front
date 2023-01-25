const { VueLoaderPlugin } = require("vue-loader");
const { VuetifyPlugin } = require("webpack-plugin-vuetify");
var LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
var webpack = require("webpack");

module.exports = {
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          plugins: ["lodash"],
          presets: [["env", { modules: false, targets: { node: 4 } }]],
        },
      },
    ],
  },
};
