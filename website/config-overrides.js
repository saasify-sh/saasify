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
  /*
  // auto-imports for antd; currently we're opting for more manual control in src/lib/antd.js
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      // '@primary-color': '#d23d67'
    }
  }),
  */
  addBabelPlugin([
    '@babel/plugin-proposal-class-properties', {
      loose: true
    }
  ]),
  addWebpackAlias({
    '@ant-design/icons/lib/dist$': path.join(__dirname, 'src/lib/icons.js')
  }),
  addWebpackPlugin(new CompressionPlugin()),
  /*
  addWebpackPlugin(new AntDesignThemePlugin({
    stylesDir: path.join(__dirname, './src/styles'),
    varFile: path.join(__dirname, './src/styles/vars.less'),
    mainLessFile: path.join(__dirname, './src/less/main.less'),
    themeVariables: [
      '@primary-color',
      '@secondary-color',
      '@text-color',
      '@text-color-secondary',
      '@heading-color',
      '@layout-body-background',
      '@btn-primary-bg',
      '@layout-header-background',
      '@border-color-base'
    ],
    indexFileName: path.join('public', 'index.html'),
    generateOnce: false // generate color.less on each compilation
  })),
  */
  (config) => {
    // allow relative imports from the top-level src directory
    config.resolve.modules = [
      path.join(__dirname, 'src')
    ].concat(config.resolve.modules)

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
