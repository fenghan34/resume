const fs = require('fs')
const path = require('path')
const axios = require('axios')
const validateResume = require('./validate-resume')
const config = require('./parse-config')()

async function getResumeBySource(source) {
  let resume = null

  if (typeof source !== 'string') {
    return resume
  }

  if (/.\.json/.test(source)) {
    const resumePath = path.join(process.cwd(), source)
    const resumeJson = fs.readFileSync(resumePath)
    resume = JSON.parse(resumeJson)
  }

  if (/^http/.test(source)) {
    resume = await axios.get(source)
  }

  return resume
}

async function getResumeByRequestUrl(requestUrl) {
  const specifiedLangSource = config.source[requestUrl.slice(1)]
  const resume = await getResumeBySource(specifiedLangSource)

  try {
    await validateResume(resume, specifiedLangSource)
  } catch (e) {
    console.error(e)
  }

  return resume
}

async function getAllResume() {
  const res = []

  for (const [lang, s] of Object.entries(config.source)) {
    res.push({
      lang,
      resume: await getResumeBySource(s),
    })
  }

  return res
}

module.exports = { getResumeBySource, getResumeByRequestUrl, getAllResume }
