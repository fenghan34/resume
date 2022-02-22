const fs = require('fs')
const {
  resolvePath,
  watchFile,
  watchDir,
  genPreviewUrlsByLanguage,
} = require('./utils')

function initWatcher({ config, cache, broadcast }) {
  const { source } = config

  const refreshAll = () => {
    cache.clear()

    const urls = Object.keys(source).map(genPreviewUrlsByLanguage).flat(1)
    broadcast(urls)
  }

  // watch resume files
  Object.entries(source).forEach(([lang, source]) => {
    fs.stat(resolvePath(source), (err, stats) => {
      if (!err && stats.isFile()) {
        watchFile(source, () => {
          const urls = genPreviewUrlsByLanguage(lang)
          urls.forEach((url) => cache.delete(url))
          broadcast(urls)
        })
      }
    })
  })

  watchFile('resume.hbs', refreshAll)

  watchFile('resume.config.js', refreshAll)

  watchDir('assets/css', refreshAll)
}

module.exports = initWatcher
