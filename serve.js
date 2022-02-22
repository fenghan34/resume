#!/usr/bin/node

const http = require('http')
const express = require('express')
const open = require('open')

const { getResumeByLanguage } = require('./utils/get-resume')
const { render } = require('./index')
const { genPDF } = require('./utils/gen-pdf')
const fs = require('fs')
const path = require('path')
const config = require('./utils/parse-config')()
const { devServer, source, PDFOptions } = config

const app = express()
const server = http.createServer(app)

const languages = Object.keys(source)

const cache = (function () {
  const cacheInner = new Map()

  Object.entries(source).forEach(([lang, source]) => {
    const sourcePath = path.join(process.cwd(), source)
    fs.stat(sourcePath, (err, stats) => {
      if (!err && stats.isFile()) {
        fs.watch(sourcePath, () => {
          cacheInner.delete(`/${lang}`)
          cacheInner.delete(`/${lang}/pdf`)
        })
      }
    })
  })

  return cacheInner
})()

async function genHtmlByLanguage(lang) {
  const resume = await getResumeByLanguage(lang)
  return await render(resume, { lang })
}

async function getPDFByLanguage(lang) {
  const html = await genHtmlByLanguage(lang)
  return await genPDF(html, PDFOptions)
}

app.get('*', (req, res, next) => {
  if (cache.has(req.url)) {
    res.send(cache.get(req.url))
    return
  }

  next()
})

languages.forEach((lang) => {
  app.get(`/${lang}/pdf`, async (req, res, next) => {
    try {
      const data = await getPDFByLanguage(lang)
      res.setHeader('content-type', 'application/pdf')
      res.send(data)

      cache.set(req.url, data)
    } catch (err) {
      next(err)
    }
  })

  app.get(`/${lang}$`, async (req, res, next) => {
    try {
      const data = await genHtmlByLanguage(lang)
      res.setHeader('content-type', 'text/html')
      res.send(data)

      cache.set(req.url, data)
    } catch (err) {
      next(err)
    }
  })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || err)
})

server.listen(devServer.port, async () => {
  const cb = (lang) => {
    const base = `http://localhost:${devServer.port}/${lang}`
    return [base, `${base}/pdf`]
  }

  const urls = languages.map(cb).flat(1)

  if (devServer.open) {
    // open browser
    await Promise.all(urls.map(open))
  }

  console.log(
    `Server is running...\nYou can check out below:\n${urls.join('\n')}`
  )
})
