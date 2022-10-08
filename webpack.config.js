const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const $BASE_ENTRY_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: $BASE_ENTRY_JS + "main.js",
    moviePlayer: $BASE_ENTRY_JS + "moviePlayer.js",
    recorder: $BASE_ENTRY_JS + "recorder.js",
    movieUploader: $BASE_ENTRY_JS + "movieUploader.js",
    commentSection: $BASE_ENTRY_JS + "commentSection.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
