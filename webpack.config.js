const path = require('path');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
 
const conf = {
  entry: './dist/module/index.js',
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = [
  Object.assign({}, conf, {
    output: {
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      filename: 'index.umd.js',
      library: 'FilestackLoader',
    },
  }),
  Object.assign({}, conf, {
    plugins: [
      new EsmWebpackPlugin()
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'var',
      filename: 'index.esm.js',
      library: 'FilestackLoader',
    },
  }),
];
