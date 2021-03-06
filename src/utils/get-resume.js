const fs = require('fs')
const axios = require('axios')
const validateResume = require('./validate-resume')
const assert = require('http-assert')
const { resolvePath } = require('.')
const config = require('./parse-config')()

function validateSourceCallback(source, err, valid) {
  assert(
    !err && valid,
    400,
    `Invalid resume source: ${source}.\n${err ? err[0].message : ''}`
  )
}

async function getResumeBySource(source) {
  assert(typeof source === 'string', 404, 'Not Found.')

  let resume = null

  if (/^http/.test(source)) {
    const { data } = await axios.get(source)
    resume = data
  } else if (/.\.json$/.test(source)) {
    const resumePath = resolvePath(source)
    const resumeJson = fs.readFileSync(resumePath)
    resume = JSON.parse(resumeJson)
  }

  assert(resume instanceof Object, 404, 'Not Found.')
  return resume
}

async function getResumeByLanguage(language) {
  const specifiedLangSource = config.source[language]
  const resume = await getResumeBySource(specifiedLangSource)

  const cb = validateSourceCallback.bind(null, specifiedLangSource)
  await validateResume(resume, cb)

  return resume
}

async function getAllResume() {
  const res = []

  for (const [lang, source] of Object.entries(config.source)) {
    const resume = await getResumeBySource(source)

    const cb = validateSourceCallback.bind(null, config.source[lang])
    await validateResume(resume, cb)

    res.push({ lang, resume })
  }

  return res
}

module.exports = { getResumeBySource, getResumeByLanguage, getAllResume }
