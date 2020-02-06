const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackNotifierPlugin = require("webpack-notifier");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const bundleFileName = 'bundle';
const dirName = 'wwwroot/dist';

module.exports = (env, argv) => {
    return {
        mode: argv.mode === "production" ? "production" : "development",
        entry: ['./Resources/index.js', './Resources/sass/index.scss'],
        output: {
            filename: bundleFileName + '.js',
            path: path.resolve(__dirname, dirName)
        },
        module: {
            rules: [
                {
                    test: /\.s[c|a]ss$/,
                    use:
                        [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    config: {
                                        ctx: {
                                            env: argv.mode
                                        }
                                    }
                                }
                            },
                            'sass-loader'
                        ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: 'url-loader?limit=100000'
                }
            ]
        },
        devtool: "inline-source-map",
        plugins: [
            new CleanWebpackPlugin(dirName, {}),
            new MiniCssExtractPlugin({
                filename: bundleFileName + '.css'
            }),
            new WebpackNotifierPlugin(),
            new BrowserSyncPlugin()
        ],
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: false,
            warnings: false,
            publicPath: false
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.scss', '.sass'],
            modules: [
                'node_modules',
                ...walkDirectories(path.resolve(__dirname, 'Resources')) // add each subdirectory under 'Resources'
            ]
        }
    };
};

// Return array of the absolute paths to each folder under basePath,
// recursively entering subdirectories
function walkDirectories(basePath, directories) {

    let contents = fs.readdirSync(basePath);
    directories = directories || [];

    contents.forEach((item) => {
        if (fs.statSync(path.join(basePath, item)).isDirectory()) {
            directories.push(path.join(basePath, item));
            walkDirectories(path.join(basePath, item), directories);
        }
    })
    return directories;
}