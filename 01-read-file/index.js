const { stdout } = process
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'text.txt')
const readStream = fs.createReadStream(filePath, 'utf-8')
let content = ''

// read file
readStream.on('data', (chunk) => {
  content += chunk
})

// when read is over show content
readStream.on('end', () => stdout.write(content))

// error handler
readStream.on('error', (err) => stdout.write(err.message))
