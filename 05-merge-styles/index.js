const { stdout } = process
const path = require('path')
const fs = require('fs')

const stylesPath = path.join(__dirname, 'styles')
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css')

const readStylesFolder = (err, files) => {
  if (err) stdout.write(err.message)

  const writeStream = fs.createWriteStream(bundlePath)

  files.forEach((file) => {
    // check is file
    const fileExt = path.extname(file.name)

    // read only css files
    if (fileExt === '.css') {
      //create path to each file
      const filePath = path.join(stylesPath, file.name)

      const readStream = fs.createReadStream(filePath, 'utf-8')

      // write to boundle
      readStream.pipe(writeStream)
    }
  })
}

fs.readdir(stylesPath, { withFileTypes: true }, readStylesFolder)
