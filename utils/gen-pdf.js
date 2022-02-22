const puppeteer = require('puppeteer')

async function genPDF(html, options) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf(options)
  await browser.close()

  return pdf
}

module.exports = { genPDF }
