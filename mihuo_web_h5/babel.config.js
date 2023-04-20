module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset', [
      '@babel/preset-env', {
        modules: false
      }
    ]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: 'element-plus',
        libraryDirectory: 'lib',
        customName:name=>`element-plus/lib/components/${name.slice(3)}`
      },
      'element-plus'
    ]
  ]
}