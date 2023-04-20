// element
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const pagesConfig = require('./pages.config')
const path = require('path')
const glob = require('glob')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin')
const px2rem = require('postcss-px2rem')

// 时间戳
const TimeStamp = new Date().getTime()

const baseUrl = process.env.VUE_APP_API
const postcss = px2rem({
  remUnit: 10 // 基准大小 baseSize，需要和rem.js中相同
})

function resolve(dir) {
  return path.join(__dirname, dir)
}

const pages = {}
glob.sync('./src/pages/**/main.ts').forEach((entry) => {
  const chunk = entry.match(/\.\/src\/pages\/(.*)\/main\.ts/)[1]
  const curr = pagesConfig[chunk]
  if (curr) {
    const pageItem = {
      entry,
      ...curr,
      chunks: process.env.NODE_ENV === 'production' ? ['chunk-libs', 'chunk-element', 'chunk-commons', 'runtime', 'index'] : ['chunk-vendors', 'chunk-common', 'index']
    }
    pages[chunk] = pageItem
  }
})
const pageLoad = {}
// 这里还是index作为默认名称 保持部署的一致性
// 判断是后台（默认的）运行或者打包环境。
pageLoad['index'] = { ...pages[process.env.VUE_APP_CURENV] }
const vueConfig = {
  pages: pageLoad,
  publicPath: './',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  // lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: `dist/${process.env.VUE_APP_LIB}`,
  runtimeCompiler: true,
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // element-plus
    types.forEach((type) => addStyleResource(config.module.rule('less').oneOf(type)))
    // 防止多页面打包卡顿
    config.plugins.delete('named-chunks')
    // 修复HMR
    config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_@', resolve(`src/pages/${process.env.VUE_APP_CURENV}`))
      .set('_v', resolve(`src/pages/${process.env.VUE_APP_CURENV}/views`))
    // .set('_pd1', resolve('src/pages/demo1'))
    // .set('_pd1v', resolve('src/pages/demo1/views'))

    // 设置svg-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.plugin('AutoImport').use(
      AutoImport({
        imports: ['vue'],
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
            exclude: new RegExp(/^(?!.*loading-directive).*$/)
          })
        ],
        dts: 'auto-imports.d.ts'
      })
    )
    config.plugin('Components').use(
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })],
        dts: 'components.d.ts'
      })
    )
    // 生产环境
    config.when(process.env.NODE_ENV === 'production', config => {
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugin('CompressionWebpackPlugin')
        .use(new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        }))
      config.plugin('TerserPlugin')
        .use(new TerserPlugin({
          terserOptions: {
            // 生产环境自动删除console
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        }))

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after(`html`)
        .use('script-ext-html-webpack-plugin', [{
          inline: /runtime\..*\.js$/
        }])
        .end()

      config
        .optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            element: {
              name: 'chunk-element', // 拆分element
              priority: 20, // 权重
              test: /[\\/]node_modules[\\/]_?element-plus(.*)/
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3, // 最小使用数
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })

      config.optimization.runtimeChunk('single')
      // ${page}改为index为了和上面的统一性
      config.plugin(`preload-index`).tap(() => [{
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }])
      config.plugins.delete(`prefetch-index`)
      // Object.keys(entryPages).forEach((page) => {
      //   // console.log(page)
      //   // 预加载
      // })
    })
  },
  configureWebpack: config => {
    // config.output = { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.js】
    //   filename: `${process.env.VUE_APP_LIB}/js/[name].${TimeStamp}.js`,
    //   chunkFilename: `${process.env.VUE_APP_LIB}/js/[name].${TimeStamp}.js`
    // }

    // 为生产环境修改配置...
    // element plus
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      // 打包文件大小配置
      config.performance = {
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000
      }
    } else {
      config.mode = 'development'
    }
    config.module = {
      rules: [
        ...config.module.rules,
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  css: {
    // extract: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.css】
    //   filename: `css/[name].${TimeStamp}.css`,
    //   chunkFilename: `css/[name].${TimeStamp}.css`
    // },
    loaderOptions: {
      less: {
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
  // 跨域代理
  devServer: {
    // overlay: {
    //   warnings: false,
    //   errors: false
    // },
    // port: 8082,
    proxy: {
      // '/api': {
      //   target: baseUrl,
      //   changeOrigin: true,
      //   ws: true,
      //   pathRewrite: {
      //     '^/api': '/api'
      //   }
      // },
      '/reports': {
        target: 'https://api.51mihuo.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/reports': '/reports'
        }
      },
      '/api': {
        target: 'https://imapibeta.erpstrong.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/basic': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/basic': '/basic'
        }
      },
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/mall': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/mall': '/mall'
        }
      },
      '/order': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/order': '/order'
        }
      },
      '/pay': {
        target: baseUrl,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/pay': '/pay'
        }
      }
    }
  }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, `./src/pages/${process.env.VUE_APP_CURENV}/styles/variables.less`) // 需要全局导入的less
      ]
    })
}

module.exports = vueConfig
