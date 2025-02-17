const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const { stdout } = process

const dirPath = path.join(__dirname, 'secret-folder')

const readSecretFolder = (err, files) => {
  if (err) stdout.write(err.message)

  files.forEach(async (file) => {
    const isFile = file.isFile()

    if (isFile) {
      const filePath = path.join(dirPath, file.name)
      const fileExt = path.extname(file.name)
      const fileName = path.basename(file.name, fileExt)

      const stat = await fsPromises.stat(filePath)
      const fileSize = stat.size
      const fileSizeStr = fileSize / 1000 + 'kb'
      const fileInfo = `${fileName} - ${fileExt.slice(1)} - ${fileSizeStr}\n`

      stdout.write(fileInfo)
    }
  })
}

fs.readdir(dirPath, { withFileTypes: true }, readSecretFolder)
