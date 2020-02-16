const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')

// const AntDesignThemePlugin = require('antd-theme-webpack-plugin')

const {
  override,
  addDecoratorsLegacy,
  addBundleVisualizer,
  addBabelPlugin,
  addWebpackAlias,
  addWebpackPlugin,
  disableEsLint
} = require('customize-cra')

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  // eslint-disable-next-line
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  addBabelPlugin([
    '@babel/plugin-proposal-class-properties',
    {
      loose: true
    }
  ]),
  addBabelPlugin('@babel/plugin-proposal-optional-chaining'),
  addWebpackAlias({
    '@ant-design/icons/lib/dist$': path.join(__dirname, 'src/lib/icons.js'),
    // TODO: I have no idea why this is necessary when locally linking react-saasify, but
    // without it we get random client-side react errors...
    react: path.resolve('../node_modules/react'),
    'react-dom': path.resolve('../node_modules/react-dom'),
    mobx: path.resolve('../node_modules/mobx'),
    'mobx-react': path.resolve('../node_modules/mobx-react'),
    'react-router-dom': path.resolve('../node_modules/react-router-dom')
  }),
  addWebpackPlugin(new CompressionPlugin()),
  (config) => {
    // allow relative imports from the top-level src directory
    config.resolve.modules = [path.join(__dirname, 'src')].concat(
      config.resolve.modules
    )

    // allow custom resolving of default directory imports by attempting to load
    // 'DirName/DirName.js' if `DirName/index.js` doesn't exist which negates
    // having a useless index.js file for every component and route.
    config.resolve.plugins = [
      new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/,
        honorIndex: true,
        honorPackage: ['browser', 'module', 'main']
      })
    ].concat(config.resolve.plugins || [])

    return config
  }
)
