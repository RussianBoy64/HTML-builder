const { stdout } = process
const path = require('path')
const fs = require('fs')
const { mkdir, rm, copyFile } = require('fs/promises')

const originalPath = path.join(__dirname, 'files')
const copyPath = path.join(__dirname, 'files-copy')

const readOriginFolder = async (err, files) => {
  if (err) stdout.write(err.message)

  // remove folder if it exists
  await rm(copyPath, { recursive: true, force: true })
  // create copy folder
  await mkdir(copyPath, { recursive: true })

  // copy files
  files.forEach(async (file) => {
    const originFilePath = path.join(originalPath, file)
    const copyFilePath = path.join(copyPath, file)

    await copyFile(originFilePath, copyFilePath)
  })
}

fs.readdir(originalPath, readOriginFolder)
