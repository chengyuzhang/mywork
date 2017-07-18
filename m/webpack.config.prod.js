const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');//编译完自动打开浏览器
const ExtractTextPlugin = require("extract-text-webpack-plugin");//分离css
const HtmlWebpackPlugin = require('html-webpack-plugin');//引用html模板
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');//自动生成html
const fs=require('fs');
const config = {
  entry: getEntry('app/entry',{
    //commons:['n-zepto']
  }),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel']
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract("style", "css!less")
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=imgs/[hash:8].[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "js/[name].js"
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      minimize: true
    }),

    new HtmlWebpackPlugin({
      chunks: ['','index'],//只加载项
      //excludeChunks: ['index'],//排队项
      alwaysWriteToDisk: true,
      chunks:['commons','app','index'],
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/index.html'),
      filename: 'index.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','topic'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/topic.html'),
      filename: 'topic.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','search'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/search.html'),
      filename: 'search.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','custom'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/custom.html'),
      filename: 'custom.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','order'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/order.html'),
      filename: 'order.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','address'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/address.html'),
      filename: 'address.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','center'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/center.html'),
      filename: 'center.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','info'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/info.html'),
      filename: 'info.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({//新增收货地址列表
      chunks: ['commons','add-address'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/add-address.html'),
      filename: 'add-address.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({//管理收货地址列表
      chunks: ['commons','manage-address'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/manage-address.html'),
      filename: 'manage-address.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({//编辑收货地址列表
      chunks: ['commons','edit-address'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/edit-address.html'),
      filename: 'edit-address.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-custom'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-custom.html'),
      filename: 'my-custom.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','order-detail'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/order-detail.html'),
      filename: 'order-detail.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','detail'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/detail.html'),
      filename: 'detail.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','result'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/result.html'),
      filename: 'result.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','search-result'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/search-result.html'),
      filename: 'search-result.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','protocol'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/protocol.html'),
      filename: 'protocol.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','protocol'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/protocol1.html'),
      filename: 'protocol1.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','protocol'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/protocol2.html'),
      filename: 'protocol2.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','jump'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/jump.html'),
      filename: 'jump.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','story'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/story.html'),
      filename: 'story.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-order-all-order'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-order-all-order.html'),
      filename: 'my-order-all-order.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-order-wait-pay'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-order-wait-pay.html'),
      filename: 'my-order-wait-pay.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-order-wait-get'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-order-wait-get.html'),
      filename: 'my-order-wait-get.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-order-ok'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-order-ok.html'),
      filename: 'my-order-ok.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','my-order-cancel'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/my-order-cancel.html'),
      filename: 'my-order-cancel.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','custom-detail'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/custom-detail.html'),
      filename: 'custom-detail.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','ok-order'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/ok-order.html'),
      filename: 'ok-order.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','gife-list'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/gife-list.html'),
      filename: 'gife-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','goods-list'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/goods-list.html'),
      filename: 'goods-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','children-list'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/children-list.html'),
      filename: 'children-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','custom-list'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/custom-list.html'),
      filename: 'custom-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','series-topic'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/series-topic.html'),
      filename: 'series-topic.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','search-list'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/search-list.html'),
      filename: 'search-list.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','goods-search-result'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/goods-search-result.html'),
      filename: 'goods-search-result.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','goods-detail'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/goods-detail.html'),
      filename: 'goods-detail.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','shopping-car'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/shopping-car.html'),
      filename: 'shopping-car.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','kind-gift'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/kind-gift.html'),
      filename: 'kind-gift.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','kind-goods'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/kind-goods.html'),
      filename: 'kind-goods.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','kind-children'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/kind-children.html'),
      filename: 'kind-children.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','kind-custom'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/kind-custom.html'),
      filename: 'kind-custom.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','find'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/find.html'),
      filename: 'find.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','cart'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/cart.html'),
      filename: 'cart.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','user-center'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/user-center.html'),
      filename: 'user-center.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','comments'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/comments.html'),
      filename: 'comments.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','goods-info'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/goods-info.html'),
      filename: 'goods-info.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons','center-set'],
      alwaysWriteToDisk: true,
      template: 'html-withimg-loader!' + path.resolve(__dirname, 'app/center-set.html'),
      filename: 'center-set.html',
      inject: true,
      cache:false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
};

module.exports = config;

function getEntry(srcDir,jsonCommons) {
  var jsPath = path.resolve(srcDir);
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = [
        path.resolve(srcDir, item)
      ];
    }
  });
  for(var name in jsonCommons){
    files[name]=jsonCommons[name];
  }
  return files;
}