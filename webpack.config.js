const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATH_CLIENT_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: PATH_CLIENT_JS + "main.js",
    videoPlayer: PATH_CLIENT_JS + "videoPlayer.js",
    recorder: PATH_CLIENT_JS + "recorder.js",
    commentSection: PATH_CLIENT_JS + "commentSection.js",
  },
  watchOptions: {
    poll: 1000, // Check for changes every second
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
            presets: [["@babel/preset-env", { targets: "defaults" }]],
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
