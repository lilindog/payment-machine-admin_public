const base = require("./webpack.base");
const { merge } = require("webpack-merge");

module.exports = merge(base, {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    devServer: {
        inline: true,
        host: "0.0.0.0",
        port: 80,
        hot: true,
        open: true
    },
    devtool: "eval-source-map"
});