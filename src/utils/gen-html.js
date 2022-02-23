const Handlebars = require('handlebars')
const gravatar = require('gravatar')
const _ = require('underscore')
const _s = require('underscore.string')
const moment = require('moment')
const { read } = require('.')
const { getResumeByLanguage } = require('./get-resume')
const { getLocale } = require('./get-locale')

function hasEmail(resume) {
  return !!resume.basics && !!resume.basics.email
}

function getNetwork(profiles, networkName) {
  return _.find(
    profiles,
    (profile) => profile.network.toLowerCase() === networkName
  )
}

function getUrlFromUsername(site, username) {
  const url_map = {
    github: 'github.com',
    twitter: 'twitter.com',
    soundcloud: 'soundcloud.com',
    pinterest: 'pinterest.com',
    vimeo: 'vimeo.com',
    behance: 'behance.net',
    codepen: 'codepen.io',
    foursquare: 'foursquare.com',
    reddit: 'reddit.com',
    spotify: 'spotify.com',
    dribble: 'dribbble.com',
    dribbble: 'dribbble.com',
    facebook: 'facebook.com',
    angellist: 'angel.co',
    bitbucket: 'bitbucket.org',
  }

  site = site.toLowerCase()

  if (!username || !url_map[site]) {
    return
  }

  switch (site) {
    case 'skype':
      return 'skype:' + username + '?call'
    case 'reddit':
    case 'spotify':
      return '//' + 'open.' + url_map[site] + '/user/' + username
    default:
      return '//' + url_map[site] + '/' + username
  }
}

async function genHTML(resume, context) {
  const { config, lang } = context
  const { templateFile, styleFile } = config

  moment.locale(lang)

  const locales = getLocale(config, lang)

  const dateFormat = locales.dateFormat || 'MMM YYYY'

  const css = read(styleFile)
  const template = read(templateFile)
  const profiles = resume.basics.profiles
  const socialSites = [
    'github',
    'linkedin',
    'stackoverflow',
    'twitter',
    'soundcloud',
    'pinterest',
    'vimeo',
    'behance',
    'codepen',
    'foursquare',
    'reddit',
    'spotify',
    'dribble',
    'dribbble',
    'facebook',
    'angellist',
    'bitbucket',
    'skype',
  ]

  if (!resume.basics.picture && hasEmail(resume)) {
    resume.basics.picture = gravatar.url(
      resume.basics.email.replace('(at)', '@'),
      {
        s: '100',
        r: 'pg',
        d: 'mm',
      }
    )
  }

  if (resume.languages) {
    resume.basics.languages = _.pluck(resume.languages, 'language').join(
      locales.comma
    )
  }

  _.each(resume.work, (workInfo) => {
    const startData = workInfo.startDate && new Date(workInfo.startDate)
    const endDate = workInfo.endDate && new Date(workInfo.endDate)

    if (startData) {
      workInfo.startDate = moment(startData).format(dateFormat)
    }

    if (endDate) {
      workInfo.endDate = moment(endDate).format(dateFormat)
    }
  })

  _.each(resume.skills, (skillInfo) => {
    if (skillInfo.level) {
      skillInfo.level = _s.capitalize(skillInfo.level.trim())
    }
  })

  _.each(resume.education, (educationInfo) => {
    _.each(['startDate', 'endDate'], (date) => {
      const dateObj = new Date(educationInfo[date])

      if (educationInfo[date]) {
        educationInfo[date] = moment(dateObj).format(dateFormat)
      }
    })
  })

  _.each(socialSites, (site) => {
    let username
    const socialAccount = getNetwork(profiles, site)

    if (socialAccount) {
      username = socialAccount.username
      resume.basics[site + '_url'] =
        getUrlFromUsername(site, username) || socialAccount.url
    }
  })

  Handlebars.registerHelper('toSocialIcon', function (text) {
    return {
      linkedin: 'ri:linkedin-box-fill',
      github: 'ri:github-fill',
      instagram: 'ri:instagram-line',
      twitter: 'ri:twitter-fill',
      website: 'ri:global-line',
      link: 'ri:arrow-right-up-line',
      portfolio: 'ri:account-circle-fill',
    }[text.trim().toLowerCase()]
  })

  Handlebars.registerHelper('join', (arr) => arr.join(locales.comma))

  Handlebars.registerHelper('breaklines', (text) => {
    text = Handlebars.Utils.escapeExpression(text)
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>')
    return new Handlebars.SafeString(text)
  })

  Handlebars.registerHelper('getBuildDate', () =>
    moment().format(locales.buildDateFormat || 'MMMM Do YYYY, h:mm:ss a')
  )

  return Handlebars.compile(template)({
    css,
    resume,
    locales,
    context,
  })
}

async function genHtmlByLanguage(lang, context) {
  const resume = await getResumeByLanguage(lang)
  return await genHTML(resume, { ...context, lang })
}

module.exports = { genHTML, genHtmlByLanguage }
