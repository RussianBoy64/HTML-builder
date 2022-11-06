const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { stdin: input, stdout: output } = process

const filePath = path.join(__dirname, 'text.txt')
const writeStream = fs.createWriteStream(filePath)
const rl = readline.createInterface({ input, output })

const writeText = (line) => {
  if (line.trim() === 'exit') {
    rl.close()
  } else {
    writeStream.write(line + '\n')
  }
}

rl.question('Please write your text \n', (answer) => {
  writeText(answer)
})

rl.on('line', (text) => {
  writeText(text)
})

rl.on('close', () => {
  output.write('Goodbye! See you next time :)')
})
