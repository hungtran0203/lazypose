const path = require('path');
const paths = require('./paths.js')

module.exports = {
  resolve: {
    alias: {
      '@lazypose': path.resolve(__dirname, '../../../../lib/packages/lazypose/dist/Lazypose.esm'),
    },
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: 1,
              localIdentName: '[path]-[name]-[local]',
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-import'),
                require('postcss-cssnext')({
                  features: {
                    customProperties: false,
                  },
                }),
              ],
            },
          },
        ],
        include: paths.appSrc,
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx|mjs)$/,
        include: paths.libSrc,
        loader: require.resolve('babel-loader'),
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      },      
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 65000,
          },
        },
      },
    ],
  },
};