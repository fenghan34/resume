const { promisify } = require('util')
const resumeSchema = require('resume-schema')

async function validateResume(resume, callback) {
  try {
    const { valid } = await promisify(resumeSchema.validate)(resume)
    callback(null, valid)
  } catch (e) {
    callback(e)
  }
}

module.exports = validateResume
