const path = require("path");
const webpack = require("webpack");

module.exports = (env, options) => {
  if (options.mode === "development") {
    require("dotenv").config({ path: ".env.test" });
  } else {
    require("dotenv").config({ path: ".env.production" });
  }
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
    plugins: [
      new webpack.DefinePlugin({
        "process.env.SECRET": JSON.stringify(process.env.SECRET),
        "process.env.CAMERA_IP": JSON.stringify(process.env.CAMERA_IP)
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, "public"),
      historyApiFallback: true,
      publicPath: "/dist",
      proxy: {
        "/api/*": {
          target: "http://localhost:3000"
        }
      }
    }
  };
};
