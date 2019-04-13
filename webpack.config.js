const path = require("path");

module.exports = (env, options) => {
  return {
    watch: options.mode === "development" ? true : false,
    entry: ["./src/index.js"],
    output: {
      path: path.resolve(__dirname, "public", "dist"),
      filename: "main.js"
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.s?css$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, "public"),
      historyApiFallback: true,
      publicPath: "/dist",
      proxy: {
        "/api/*": {
          target: "http://localhost:3069"
        }
      }
    }
  };
};
