const { stdout } = process
const path = require('path')
const fs = require('fs')
const { mkdir, rm, copyFile } = require('fs/promises')

const projectPath = path.join(__dirname, 'project-dist')
const componentsPath = path.join(__dirname, 'components')
const templatePath = path.join(__dirname, 'template.html')
const deployedIndexPath = path.join(projectPath, 'index.html')
const stylesPath = path.join(__dirname, 'styles')
const deployedStylesPath = path.join(projectPath, 'style.css')
const assetsPath = path.join(__dirname, 'assets')
const deployedAssetsPath = path.join(projectPath, 'assets')

const createIndexHTML = (err, files) => {
  if (err) stdout.write(err.message)

  const readSteam = fs.createReadStream(templatePath, 'utf-8')
  let template = ''

  // read template
  readSteam.on('data', (chunk) => {
    template += chunk
  })

  // add components html
  readSteam.on('end', () => {
    files.forEach((file) => {
      // check is file extansion
      const fileExt = path.extname(file.name)

      if (fileExt === '.html') {
        const fileName = path.basename(file.name, fileExt)
        const filePath = path.join(componentsPath, file.name)
        let component = ''
        const readComponent = fs.createReadStream(filePath, 'utf-8')
        const writeSteam = fs.createWriteStream(deployedIndexPath)

        readComponent.on('data', (chunk) => {
          component += chunk
        })

        // // add component to template and write index.html
        readComponent.on('end', () => {
          template = template.replace(`{{${fileName}}}`, component)
          writeSteam.write(template)
        })
      }
    })
  })
}

const addStyles = (err, files) => {
  if (err) stdout.write(err.message)

  const writeStream = fs.createWriteStream(deployedStylesPath)

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

const copyAssets = async (originDir, deployDir) => {
  // remove existing folder
  await rm(deployDir, { recursive: true, force: true })

  // craate new folder
  await mkdir(deployDir, { recursive: true })

  fs.readdir(originDir, { withFileTypes: true }, (err, files) => {
    if (err) stdout.write(err.message)

    files.forEach((file) => {
      const originPath = path.join(originDir, file.name)
      const deployPath = path.join(deployDir, file.name)

      if (file.isFile()) {
        copyFile(originPath, deployPath)
      } else {
        copyAssets(originPath, deployPath)
      }
    })
  })
}

const createPage = async () => {
  // remove existing folder
  await rm(projectPath, { recursive: true, force: true })

  // craate new folder
  await mkdir(projectPath, { recursive: true })

  fs.readdir(componentsPath, { withFileTypes: true }, createIndexHTML)

  fs.readdir(stylesPath, { withFileTypes: true }, addStyles)

  copyAssets(assetsPath, deployedAssetsPath)
}

createPage()
