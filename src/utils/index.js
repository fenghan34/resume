const fs = require('fs')
const path = require('path')

function resolvePath(...paths) {
  return path.join(process.cwd(), ...paths)
}

function genPreviewUrlsByLanguage(lang) {
  return [`/${lang}`, `/${lang}/pdf`]
}

function watch(filename, options, callback) {
  fs.watch(resolvePath(filename), callback)
}

function read(filename) {
  return fs.readFileSync(resolvePath(filename), 'utf-8')
}

module.exports = { resolvePath, watch, read, genPreviewUrlsByLanguage }
