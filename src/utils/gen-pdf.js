const puppeteer = require('puppeteer')
const { genHtmlByLanguage } = require('./gen-html')

async function genPDF(html, context) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf(context.config.PDFOptions)
  await browser.close()

  return pdf
}

async function getPDFByLanguage(lang, context) {
  const html = await genHtmlByLanguage(lang, context, true)
  return await genPDF(html, context)
}

module.exports = { genPDF, getPDFByLanguage }
