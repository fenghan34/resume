const fs = require('fs')
const path = require('path')
const axios = require('axios')
const validateResume = require('./validate-resume')
const assert = require('assert')
const config = require('./parse-config')()

function validateSourceCallback(source, err, valid) {
  assert(!err && valid, `Invalid resume source: ${source}`)
}

async function getResumeBySource(source) {
  let resume = null

  if (typeof source !== 'string') {
    return resume
  }

  if (/^http/.test(source)) {
    const { data } = await axios.get(source)
    resume = data
  } else if (/.\.json$/.test(source)) {
    const resumePath = path.join(process.cwd(), source)
    const resumeJson = fs.readFileSync(resumePath)
    resume = JSON.parse(resumeJson)
  }

  return resume
}

async function getResumeByRequestUrl(requestUrl) {
  const specifiedLangSource = config.source[requestUrl.slice(1)]
  const resume = await getResumeBySource(specifiedLangSource)

  await validateResume(
    resume,
    validateSourceCallback.bind(null, specifiedLangSource)
  )

  return resume
}

async function getAllResume() {
  const res = []

  for (const [lang, source] of Object.entries(config.source)) {
    const resume = await getResumeBySource(source)

    await validateResume(
      resume,
      validateSourceCallback.bind(null, config.source[lang])
    )

    res.push({
      lang,
      resume,
    })
  }

  return res
}

module.exports = { getResumeBySource, getResumeByRequestUrl, getAllResume }
