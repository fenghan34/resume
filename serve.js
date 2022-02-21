#!/usr/bin/node

const http = require('http')
const open = require('open')
const { getResumeByRequestUrl } = require('./utils/get-resume')
const { render } = require('./index')
const config = require('./utils/parse-config')()

async function serve(config) {
  const { devServer, source } = config

  const server = http.createServer(async (req, res) => {
    const resume = await getResumeByRequestUrl(req.url)

    if (resume instanceof Object) {
      let htmlStr = ''

      try {
        htmlStr = await render(resume, { lang: req.url.slice(1) })
      } catch (e) {
        console.error(e.message || e)
      }

      res.writeHead(200, {
        'Content-Type': 'text/html',
      })

      res.end(htmlStr)
    } else {
      res.statusCode = 404
      res.end()
    }
  })

  server.listen(devServer.port, async () => {
    const urls = Object.keys(source).map(
      (lang) => `http://localhost:${devServer.port}/${lang}`
    )

    if (devServer.open) {
      await Promise.all(urls.map(open))
    }

    console.log(
      `Server is running...\nYou can check out below:\n${urls.join('\n')}`
    )
  })
}

try {
  serve(config)
} catch (e) {
  console.error(e)
  process.exit(1)
}
