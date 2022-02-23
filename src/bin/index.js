#!/usr/bin/env node

const minimist = require('minimist')
const dev = require('../serve')
const build = require('../build')
const config = require('../utils/parse-config')()

const main = async () => {
  const args = minimist(process.argv.slice(2))
  const firstCommand = args._[0]

  switch (firstCommand) {
    case 'dev':
      dev(config)
      break
    case 'build':
      await build(config)
      break
    default:
      throw new Error('command not fount.')
  }
}

main()
  .then(() => {})
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
