/** @type {import('./resume.config').Config} */
const config = {
  source: {
    zh: 'https://gist.githubusercontent.com/fenghan34/b2143ef804b6d074cdf17cbe29e60695/raw/a84d1acc70e1083695fcc78821b98a512903c1f0/resume.zh.json',
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
