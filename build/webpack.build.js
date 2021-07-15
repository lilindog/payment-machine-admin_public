const { CleanWebpackPlugin } = require("clean-webpack-plugin");//打包前删除ouput目录之前的打包文件的插件
const miniCssPlugin = require("mini-css-extract-plugin");//分离css文件插件
const ocawp = require("optimize-css-assets-webpack-plugin");//压缩css文件插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");
const base = require("./webpack.base");

module.exports = merge(base, {
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            minSize: 1,
            minChunks: 1,
            cacheGroups: {
                comm: {
                    test: /.*\/node_modules\/.*/,
                    name: "comm",
                    priority: 1
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [miniCssPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: [miniCssPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        
        //分离css
        new miniCssPlugin({
            filename: "css/[name]-[hash:4].css",
            chunkFilename: "css/[name]-[hash:4].css"
        }),

        //压缩css
        new ocawp({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
        }),

        // 打包结果依赖报表
        new BundleAnalyzerPlugin({ analyzerMode: "static" })
    ]
});