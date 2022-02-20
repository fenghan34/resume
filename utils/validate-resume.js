const { promisify } = require('util')
const resumeSchema = require('resume-schema')

async function validateResume(resume, specifiedLangSource) {
  const valid = await promisify(resumeSchema.validate)(resume)

  if (!valid) {
    throw new Error(`Invalid resume source: ${specifiedLangSource}`)
  }
}

module.exports = validateResume
