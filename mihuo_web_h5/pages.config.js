/**
 * 多页应用配置，只需要配置基础路径即可。
 */

const pagesConfig = {
  admin: {
    template: 'public/admin/index.html',
    title: '后台管理',
    chunks: ['chunk-vendors', 'chunk-common', 'ui']
  },
  cityoperator: {
    template: 'public/cityoperator/index.html',
    title: '城市运营',
    chunks: ['chunk-vendors', 'chunk-common', 'text']
  },
  enterprise: {
    template: 'public/enterprise/index.html',
    title: '企业端',
    chunks: ['chunk-vendors', 'chunk-common', 'text']
  }
}
module.exports = pagesConfig
