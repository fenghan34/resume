const http = require('http')
const express = require('express')
const open = require('open')
const { genHtmlByLanguage } = require('./utils/gen-html')
const { getPDFByLanguage } = require('./utils/gen-pdf')

const serve = (config) => {
  const { broadcast } = require('./socket')(config)
  const cache = new Map()
  const app = express()
  const server = http.createServer(app)

  const context = { config, cache, broadcast, dev: true }

  require('./watcher')(context)

  app.get('*', (req, res, next) => {
    if (cache.has(req.url)) {
      return res.send(cache.get(req.url))
    }

    next()
  })

  const languages = Object.keys(config.source)

  languages.forEach((lang) => {
    app.get(`/${lang}/pdf`, async (req, res, next) => {
      try {
        const data = await getPDFByLanguage(lang, context)
        res.setHeader('content-type', 'application/pdf')
        res.send(data)

        cache.set(req.url, data)
      } catch (err) {
        next(err)
      }
    })

    app.get(`/${lang}$`, async (req, res, next) => {
      try {
        const data = await genHtmlByLanguage(lang, context)
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

  const { devServer } = config

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
      `CV server is running...\nYou can check out below:\n${urls.join('\n')}`
    )
  })
}

module.exports = serve
