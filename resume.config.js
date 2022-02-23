/** @type {import('./src/resume.config').Config} */
const config = {
  source: {
    'zh-CN': 'resume.json',
    en: 'resume.en.json',
  },
  devServer: {
    socketPort: 8888,
    port: 8000,
    open: false,
  },
  outputDir: 'dist',
  localeDir: 'locale',
  styleFile: 'styles/css/theme.css',
  templateFile: 'template.hbs',
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
