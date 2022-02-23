const fs = require('fs')
const path = require('path')
const { genHtmlByLanguage } = require('./utils/gen-html')
const { genPDF } = require('./utils/gen-pdf')
const { resolvePath } = require('./utils')

function writeFile(filepath, file) {
  fs.writeFileSync(filepath, file, {
    encoding: 'utf-8',
    flag: 'a+',
  })
}

async function build(config) {
  console.log('Clear last output...')

  const distDir = resolvePath(config.outputDir || 'dist')
  fs.rmSync(distDir, { force: true, recursive: true })
  fs.mkdirSync(distDir)

  console.log('Build...')

  for (const lang of Object.keys(config.source)) {
    console.log(`Build process on "${lang}"...`)

    const context = { config }
    const html = await genHtmlByLanguage(lang, context)
    const pdf = await genPDF(html, context)

    writeFile(path.join(distDir, `${lang}.html`), html)
    writeFile(path.join(distDir, `${lang}.pdf`), pdf)
  }

  console.log('done')
}

module.exports = build
