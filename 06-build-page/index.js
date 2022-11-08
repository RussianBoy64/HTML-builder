const { stdout } = process
const path = require('path')
const fs = require('fs')
const { mkdir, rm, copyFile } = require('fs/promises')

const projectPath = path.join(__dirname, 'project-dist')
const componentsPath = path.join(__dirname, 'components')
const templatePath = path.join(__dirname, 'template.html')
console.log(componentsPath)

const createPage = async (err, files) => {
  if (err) stdout.write(err.message)

  // remove existing folder
  await rm(projectPath, { recursive: true, force: true })

  // craate new folder
  await mkdir(projectPath, { recursive: true })
}

fs.readdir(componentsPath, { withFileTypes: true }, createPage)
