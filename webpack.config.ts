import { resolve, join } from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  entry: './app/index.tsx',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".css",
      ".scss",
    ],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.html?$/,
        loader: 'html-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
    }),
  ],
  devServer: {
    contentBase: join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};

export default config;