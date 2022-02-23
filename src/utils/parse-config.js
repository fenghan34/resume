const fs = require('fs')
const { resolvePath } = require('.')

function parseConfig() {
  const configFileName = 'resume.config.js'
  const configPath = resolvePath(configFileName)

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Could not find "${configFileName}".\nPlease provide config file.`
    )
  }

  const { devServer, source, ...rest } = require(configPath)

  if (!source || Object.values(source).filter(Boolean).length === 0) {
    throw new Error('Please specify at least one resume source.')
  }

  return {
    source,
    devServer: { port: 3333, socketPort: 4444, open: false, ...devServer },
    ...{
      outputDir: 'dist',
      localeDir: 'locale',
      styleFile: 'theme.css',
      templateFile: 'template.hbs',
    },
    ...rest,
    languages: Object.keys(source),
  }
}

module.exports = parseConfig
