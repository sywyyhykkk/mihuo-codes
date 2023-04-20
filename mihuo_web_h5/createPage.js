const pageTemplate = require('./PageTemplate')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const filesPage = './src/pages/admin/views'
const filesComponent = './src/pages/components'
rl.question('请输入页面名称：', (res) => {
  const createFilesName = res
  createFiles(createFilesName, filesPage)
})

function createFiles(createFilesName, Path) {
  // eslint-disable-next-line handle-callback-err
  fs.readdir(Path, (error, files) => {
    if (error) {
      // eslint-disable-next-line no-throw-literal
      throw '文件夹读取失败'
    }
    // 判断是第一层目录还是第二层
    if (files.includes(createFilesName.split('/')[0]) && createFilesName.split('/')[1]) {
      console.log(createFilesName)
    }
    // 新增主目录
    if (!files.includes(createFilesName)) {
      const newfiles = Path + '/' + createFilesName + '/' + 'admin.vue'
      // eslint-disable-next-line handle-callback-err
      fs.mkdir(Path + '/' + createFilesName, (error) => {
        // eslint-disable-next-line handle-callback-err
        createFilesName = createFilesName.toString()

        const name = createFilesName.substr(0, 1).toUpperCase() + createFilesName.substr(1)
        // eslint-disable-next-line handle-callback-err
        fs.writeFile(newfiles, pageTemplate(`'${name}'`), (error) => {

        })
      })
    }
  })
}

