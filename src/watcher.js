const fs = require('fs')
const { resolvePath, watch, genPreviewUrlsByLanguage } = require('./utils')

function initWatcher({ config, cache, broadcast }) {
  const { source, localeDir, styleFile, templateFile } = config

  // watch resume files
  Object.entries(source).forEach(([lang, source]) => {
    if (fs.existsSync(resolvePath(source))) {
      watch(source, null, () => {
        const urls = genPreviewUrlsByLanguage(lang)
        urls.forEach((url) => cache.delete(url))
        broadcast(urls)
      })
    }
  })

  const refresh = () => {
    cache.clear()
    const urls = Object.keys(source).map(genPreviewUrlsByLanguage).flat(1)
    broadcast(urls)
  }

  const files = ['resume.config.js', templateFile, styleFile]

  files.forEach((filename) => {
    watch(filename, null, refresh)
  })

  watch(localeDir, { recursive: true }, refresh)
}

module.exports = initWatcher
