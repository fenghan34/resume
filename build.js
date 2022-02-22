const fs = require('fs-extra')
const path = require('path')
const { getAllResume } = require('./utils/get-resume')
const { render } = require('./index')
const { genPDF } = require('./utils/gen-pdf')
const { resolvePath } = require('./utils')
const config = require('./utils/parse-config')()

const distDir = resolvePath(config.outputDir || 'dist')

async function clearDist() {
  await fs.remove(distDir)
  await fs.ensureDir(distDir)
}

async function writeFile(file, filename) {
  const filePath = path.join(distDir, `${filename}`)
  await fs.writeFile(filePath, file, { encoding: 'utf-8' })
}

async function build() {
  console.log('Clear...')
  await clearDist()

  console.log('Parse resources...')
  const allResume = await getAllResume()

  console.log('Build...')
  return await Promise.all(
    allResume.map(async ({ lang, resume }) => {
      const html = await render(resume, { lang })
      await writeFile(html, `${lang}.html`)

      const pdf = await genPDF(html, config.PDFOptions)
      await writeFile(pdf, `${lang}.pdf`)
    })
  )
}

build()
  .then(() => {
    console.log('Done.')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
