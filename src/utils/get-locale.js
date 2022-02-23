const fs = require('fs')
const { resolvePath } = require('.')

function getLocale(config, language) {
  return JSON.parse(
    fs.readFileSync(resolvePath(config.localeDir, `${language}.json`), 'utf-8')
  )
}

module.exports = { getLocale }
