const fs = require('fs')
const path = require('path')

function resolvePath(...paths) {
  return path.join(process.cwd(), ...paths)
}

function genPreviewUrlsByLanguage(lang) {
  return [`/${lang}`, `/${lang}/pdf`]
}

function watchFile(filename, callback) {
  fs.watch(resolvePath(filename), callback)
}

function watchDir(dir, callback) {
  fs.watch(resolvePath(dir), { recursive: true }, callback)
}

module.exports = { resolvePath, watchFile, watchDir, genPreviewUrlsByLanguage }
