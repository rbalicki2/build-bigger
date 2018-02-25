import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import childProcess from 'child_process';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const isProduction = (process.env.NODE_ENV === 'production');

const getGitRev = () => process.env.CIRCLE_SHA1
  || childProcess.execSync('git rev-parse HEAD').toString().trim();

const staticFolder = isProduction
  ? getGitRev()
  : 'static';

// locally, we cannot have a leading slash. In production, though,
// we want one, because otherwise the request will not be relative to the root.
const staticFolderWithSlash = `${isProduction ? '/' : ''}${staticFolder}`;

const entryFirstHalf = isProduction ? [] : ['react-hot-loader/patch'];

const fileLoaderString = `file-loader?name=${staticFolderWithSlash}/[name].[ext]`;

export default {
  entry: {
    [`${staticFolderWithSlash}/bundle.js`]: entryFirstHalf.concat([
      './src/index.jsx',
    ]).concat(
      isProduction
        ? []
        : [
          'webpack-dev-server/client?http://localhost:3000',
          'webpack/hot/only-dev-server',
        ]
    ),
  },
  resolve: {
    modules: ['node_modules', __dirname],
    extensions: ['.js', '.jsx'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      environment: path.join(
        __dirname, `src/environments/${process.env.NODE_ENV || 'development'}`
      ),
    },
  },
  output: {
    filename: '[name]',
    path: path.resolve('dist'),
    publicPath: '',
  },
  devtool: isProduction ? undefined : '#cheap-module-eval-source-map',
  module: {
    loaders: [

      // JS
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
        ],
      },

      // scss
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },

      // images
      {
        test: /\.(jpeg|png|jpg|ico|ttf|otf|xml|gif)$/,
        loader: fileLoaderString,
      },

      // blah.svg?external causes it to be loaded as a file, e.g. for favicons
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /external/,
            use: fileLoaderString,
          },
          {
            use: ['babel-loader', 'react-svg-loader'],
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.tpl.html',
      filename: path.join(isProduction ? staticFolder : '', 'index.html'),
    }),
  ].concat(isProduction
    ? [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify('production') },
      }),
      new UglifyJsPlugin({ sourceMap: false }),
    ]
    : [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ]
  ),
};
