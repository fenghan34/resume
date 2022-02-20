/** @type {import('./resume.config').Config} */
const config = {
  source: {
    zh: 'resume.zh.json',
    en: 'resume.en.json',
  },
  devServer: {
    port: 8000,
    open: true,
  },
  outputDir: 'dist',
  PDFOptions: {
    format: 'A4',
    displayHeaderFooter: false,
    printBackground: true,
    margin: {
      top: '0.4in',
      bottom: '0.4in',
      left: '0.4in',
      right: '0.4in',
    },
  },
}

module.exports = config
