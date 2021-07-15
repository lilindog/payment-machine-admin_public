const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlPlugin = require("html-webpack-plugin");
const parseEnv = require("parseenv");

module.exports = {
    mode: process.env.WEBPACK_MODE,
    entry: path.join(__dirname, "../src/index.js"),
    output: {
        publicPath: "/",
        path: path.join(__dirname, "../dist"),
        filename: "js/[name]-[contenthash:4].js"
    },
    resolve: {
        mainFiles: ["index"],
        extensions: [".js", ".vue",  ".less", ".css"],
        alias: {
            "@tools": path.resolve(__dirname, "../src/tools"),
            "@api": path.resolve(__dirname, "../src/api"),
            "@storage": path.resolve(__dirname, "../src/tools/storage"),
            "@views": path.resolve(__dirname, "../src/homeChildPages"),
            "@components": path.resolve(__dirname, "../src/publicComponents"),
            "@pages": path.resolve(__dirname, "../src/pages")
        }
    },
    externals: {
        "element-ui": "ELEMENT",
        "vue": "Vue"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ["vue-loader"] 
            },
            {
               test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
               use: [{
                    loader: "file-loader",
                    options:{
                        outputPath: "font",
                        name: "[name]-[hash:4].[ext]"
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options:{
                        outputPath: "img",
                        name: "[name]-[hash].[ext]"
                    }
                }]
            }
        ]
    },
    plugins: [
        //必选，vue官网说的用了vue-loader就得用该插件
        new VueLoaderPlugin(),
        
        //不写这个前端预览会报错,该插件与热更新有关
        new webpack.HotModuleReplacementPlugin(),

        //处理html
        new htmlPlugin({
            minify: process.env.WEBPACK_MODE === "production" ? true : false,
            title: "",
            filename: "./index.html",
            template: "./src/index.html",
            favicon: path.resolve('./src/static/img/supplier.ico'),
            hash: true
        }),

        // 环境变量注入
        new webpack.DefinePlugin({
            ENV: JSON.stringify(Object.assign(parseEnv(
                process.env.WEBPACK_MODE === "production" ?
                "./env/production.env" :
                process.env.WEBPACK_MODE === "development" ?
                "./env/development.env" :
                console.log(".env 文件读取失败！")
            ), { WEBPACK_MODE: process.env.WEBPACK_MODE }))
        })
    ]
}