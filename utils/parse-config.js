const path = require('path')
const fs = require('fs')

function parseConfig() {
  const configFileName = 'resume.config.js'
  const configPath = path.join(process.cwd(), configFileName)

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
    ...rest,
    source,
    devServer: { port: 3000, open: false, ...devServer },
  }
}

module.exports = parseConfig
