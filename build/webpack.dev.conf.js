"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {
          warnings: false,
          errors: true
        }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: {
      "/token": {
        //authorization-server:8190
        //king-hsk.51vip.biz:47477
        // target: 'http://192.168.0.225:8190',
        // target: 'http://192.168.0.27:9529',
        // target: 'http://king-hsk.51vip.biz:47477',
        // target: 'http://47.112.167.239:8190',
        // target: "http://47.112.167.239:8213/" //后端目标接口地址
        // target: 'http://192.168.0.211:8213/',
        target: "http://192.168.0.27:9527"
        // target: 'ws://47.112.167.239:9527/',//后端目标接口地址
        // secure: false,
      },
      "/": {
        //web-server:8188
        //king-hsk.51vip.biz:16682
        // target: 'ws://47.112.167.239:9527/',//后端目标接口地址
        target: "http://192.168.0.27:9527"
        // target: 'http://192.168.0.225:8188',
        // target: 'http://king-hsk.51vip.biz:16682',
        // target: 'http://47.112.167.239:8188',
        // target: "http://47.112.167.239:8214"
        // target: "http://47.112.167.225:8214"
        // target: 'http://192.168.0.211:8214/',
        // secure: false,
      },
      "/socket": {
        target: "http://192.168.0.27:8217",
        // target: 'ws://192.168.0.225:8201/',//后端目标接口地址
        // target: 'ws://192.168.0.211:8217/',//后端目标接口地址
        // target: 'ws://47.112.167.239:8189/',//后端目标接口地址
        // target: 'ws://47.112.167.239:8217/',//后端目标接口地址
        // target: 'ws://192.168.0.13:8217/', //后端目标接口地址
        // target: 'ws://192.168.0.94:8217/', //后端目标接口地址
        // target: 'ws://127.0.0.1:9528/', //后端目标接口地址
        changeOrigin: true, //是否允许跨域
        pathRewrite: {
          "^/socket": "" //重写,
        },
        ws: true //开启ws, 如果是http代理此处可以不用设置
      }
    },
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  performance: {
    hints: "warning",
    //入口起点的最大体积
    maxEntrypointSize: 500000000,
    //生成文件的最大体积
    maxAssetSize: 300000000,
    //只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith(".js");
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env")
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
      favicon: resolve("favicon.ico"),
      title: "ldcsmp-web"
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      );

      resolve(devWebpackConfig);
    }
  });
});
