const path = require("path");

module.exports = (env, options) => {
  return {
    watch: options.mode === "development" ? true : false,
    entry: ["@babel/polyfill", "./src/index.js"],
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
        }
      ]
    }
  };
};
