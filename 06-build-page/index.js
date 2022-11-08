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
const fontsPath = path.join(assetsPath, 'fonts')
console.log(fontsPath)
const imgPath = path.join(assetsPath, 'img')
const svgPath = path.join(assetsPath, 'svg')
const deployedAssetsPath = path.join(projectPath, 'assets')
const deployedFontsPath = path.join(deployedAssetsPath, 'fonts')
const deployedImgPath = path.join(deployedAssetsPath, 'img')
const deployedDvgPath = path.join(deployedAssetsPath, 'svg')

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

const copyFonts = async (err, files) => {
  if (err) stdout.write(err.message)

  // craate new folder
  await mkdir(deployedFontsPath, { recursive: true })

  // copy files
  files.forEach(async (file) => {
    const originFilePath = path.join(fontsPath, file)
    const copyFilePath = path.join(deployedFontsPath, file)

    await copyFile(originFilePath, copyFilePath)
  })
}

const copyImgs = async (err, files) => {
  if (err) stdout.write(err.message)

  // craate new folder
  await mkdir(deployedImgPath, { recursive: true })

  // copy files
  files.forEach(async (file) => {
    const originFilePath = path.join(imgPath, file)
    const copyFilePath = path.join(deployedImgPath, file)

    await copyFile(originFilePath, copyFilePath)
  })
}

const copySvgs = async (err, files) => {
  if (err) stdout.write(err.message)

  // craate new folder
  await mkdir(deployedDvgPath, { recursive: true })

  // copy files
  files.forEach(async (file) => {
    const originFilePath = path.join(svgPath, file)
    const copyFilePath = path.join(deployedDvgPath, file)

    await copyFile(originFilePath, copyFilePath)
  })
}

const createPage = async () => {
  // remove existing folder
  await rm(projectPath, { recursive: true, force: true })

  // craate new folder
  await mkdir(projectPath, { recursive: true })

  fs.readdir(componentsPath, { withFileTypes: true }, createIndexHTML)
  fs.readdir(stylesPath, { withFileTypes: true }, addStyles)

  // remove existing folder
  await rm(deployedAssetsPath, { recursive: true, force: true })

  // craate new folder
  await mkdir(deployedAssetsPath, { recursive: true })

  fs.readdir(fontsPath, copyFonts)
  fs.readdir(imgPath, copyImgs)
  fs.readdir(svgPath, copySvgs)
}

createPage()
