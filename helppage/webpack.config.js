/**************************************************
 *
 *  Webpack
 *
 **************************************************/
const webpack = require('webpack');

/** Plugin **/
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** Helper **/
const autoprefixer = require('autoprefixer');
const path = require('path');
const glob = require("glob");
const fs = require("fs");



/** Path **/
//SRC
var SRC_DIR = path.resolve(__dirname, './src');
var BOWER_LIB_DIR = SRC_DIR + '/bower_components';
var SCRIPT_SRC_DIR = SRC_DIR + '/js';
var STYLE_SRC_DIR = SRC_DIR + '/css';
var IMAGE_SRC_DIR = SRC_DIR + '/img';

var TEMP_SRC_PATH = path.resolve(__dirname,  './temp/temp_to_full_reload.html');
var CROSSMAN_DIR = path.resolve(__dirname, '../../crossman');
var BOXMAN_DIR = path.resolve(__dirname, '../../boxman');
var POPMAN_DIR = path.resolve(__dirname, '../../popman');
var KEYMAN_DIR = path.resolve(__dirname, '../../keyman');


//DIST
var DIST_DIR = path.resolve(__dirname,  './dist');
var SCRIPT_DIST_DIR = DIST_DIR + '/js';
var STYLE_DIST_DIR = DIST_DIR + '/css';

//SJDocument-Maker
var boxmanJsList = glob.sync(BOXMAN_DIR+ "/src/**/boxman.js");
var popmanJsList = glob.sync(POPMAN_DIR+ "/src/**/popman.js");
var crossmanJsList = glob.sync(CROSSMAN_DIR + "/src/**/crossman.js");
var thisJsList = glob.sync(SRC_DIR + "/**/*.js");
var dependencyList = [].concat(crossmanJsList).concat(boxmanJsList).concat(popmanJsList);




/*************************
 *  PLUGIN
 *************************/
function makeCommonPlugins(sjMarkDown){
    return {
        copyWebpackPlugin:[
            new CopyWebpackPlugin([
                {
                    from: path.resolve(SRC_DIR, './app'),
                    to: path.resolve(DIST_DIR, './app'),
                }
            ]),
        ],
        extractTextPlugin:[
            new ExtractTextPlugin({
                filename: './css/style.bundle.css',
                allChunks: true
            }),
        ],
        htmlWebpackPlugin:[
            /** Main Page (index.html) **/
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: SRC_DIR + '/index.hsb',
                chunks: ['help'],
                chunksSortMode: 'manual',
                inject: 'head',  //head or body
                title: 'Moving to document',
                homePage: sjMarkDown.homePage,
                minify: {
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: true,
                },
            }),
        ]
    };
}




/*************************
 *
 *  Modules
 *
 *************************/
module.exports = (env, options) => {

    console.log('==================================================');
    console.log('===== env', env);
    console.log('===== options', options);
    var pathToDocs = env.docs;
    var mode = env.mode;

    //SjMarkDown //TODO:손봐
    // var ttta = path.resolve(env.docs);
    var pathListToDocs = glob.sync(pathToDocs);
    pathListToDocs = (pathListToDocs.length > 0) ? pathListToDocs : [pathToDocs];
    var config;
    var pluginList;
    var commonPlugins;

    [pathListToDocs[0]].forEach(function(it){
        console.log("=====", it);
        var sjMarkDown = require(it);
        sjMarkDown.setModeDevelopment((mode=='development')).setTemplate(SRC_DIR + '/template.hsb').setChunks(['help']);
        DIST_DIR = (sjMarkDown.alias) ? path.resolve(DIST_DIR, sjMarkDown.alias) : DIST_DIR;
        pluginList = sjMarkDown.generateDevelopWebpackPluginList(TEMP_SRC_PATH);
        commonPlugins = makeCommonPlugins(sjMarkDown);
    });

    console.log('checkcehcehk', commonPlugins);


    config = {
        /*************************
         *  Entry
         *************************/
        entry: {
            'help': dependencyList.concat(thisJsList),
            // 'preRender.polyfill': [LIB_SCRIPT_SRC_DIR + '/preRender.polyfill.js']
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias:{
                'this_lib_js': path.resolve(BOXMAN_DIR, './src/js/boxman.js'),
                'this_lib_css': path.resolve(BOXMAN_DIR, './src/css/boxman.css'),

                'this_help_js': path.resolve(SCRIPT_SRC_DIR, './main.js'),
                'this_help_css': path.resolve(STYLE_SRC_DIR, './main.css'),
                'markdown_css': path.resolve(STYLE_SRC_DIR, './markdown.css'),
                'github_css': path.resolve(STYLE_SRC_DIR, './github.css'),

                // 'ace': path.resolve(BOWER_LIB_DIR, 'ace-builds/src-min-noconflict/ace.js'),
            }
        },
        // postcss: [
        //   autoprefixer({
        //     browsers: ['last 2 versions', '> 10%', 'ie 9']
        //   })
        // ],

        /*************************
         *  MODULE
         *************************/
        module: {
            loaders: [
                /** js  **/
                { test: /\.js$/, loaders: ['babel-loader'], exclude: /(node_modules|bower_components)/ },
                /** css  **/
                {
                    test: /\.css$/, loader: ExtractTextPlugin.extract({
                        use: ['css-loader'],
                        fallback: 'style-loader',
                        publicPath: '',
                        allChunks: true
                    })
                },
                /** html **/
                { test: /\.html$/, loader: 'raw-loader' },
                /** hsb **/
                { test: /\.hbs$/, loader: "handlebars-loader" },
                /** images **/
                { test:  /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
                /** Markdown **/
                { test: /\.md$/, loader: ['html-loader', 'markdown-loader'] },
                /** font **/
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
                /** font **/
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=fonts/[name].[ext]' },
            ] ,
        }
    };



    switch (mode){
        case 'development':
            console.log('######################### DEVELOPMENT !!!');
            config.devServer = {
                contentBase: path.join(__dirname, "src"),
                port: 8081,
                watchContentBase: true
                // compress: true,
                // clientLogLevel: "none",
                // historyApiFallback: true,
            };
            config.devtool =  'cheap-eval-source-map';
            config.output = {
                publicPath: '/',
                filename: '[name].bundle.js',
                chunkFilename: '[name].js',
                sourceMapFilename: '[name].js.map'
            };
            config.plugins = []
                .concat([
                    /** Automatically Reload (when source code is fixed) **/
                    new webpack.HotModuleReplacementPlugin(),
                ])
                .concat(commonPlugins.copyWebpackPlugin)
                .concat(commonPlugins.extractTextPlugin)
                .concat(commonPlugins.htmlWebpackPlugin)
                .concat([
                    /** Open Browser After bundling **/
                    new WebpackBrowserPlugin()
                ])
                .concat(pluginList)
                ;
            break;



        default:
            console.log('######################### PRODUCT !!!');
            config.module.loaders[0].loaders = ['babel-loader', 'webpack-strip?strip[]=debug,strip[]=console.log,strip[]=console.warn,strip[]=console.dir'];
            config.output = {
                path: DIST_DIR,
                filename: 'js/[name].bundle.js',
            };
            config.plugins = []
                .concat([
                    /** Clean **/
                    new CleanWebpackPlugin([DIST_DIR]),
                    new webpack.optimize.UglifyJsPlugin({
                        compressor: {
                            warnings: false,
                        },
                    }),
                    new webpack.optimize.OccurrenceOrderPlugin(),
                ])
                .concat(commonPlugins.copyWebpackPlugin)
                .concat(commonPlugins.extractTextPlugin)
                .concat(commonPlugins.htmlWebpackPlugin)
                .concat(pluginList)
                ;
            break;
    }


    return config;
};