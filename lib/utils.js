
var request = require('superagent')
  , crypto = require('crypto')
  , qs = require('querystring')

module.exports = {
  fire: fire,
  makeWebHooks: makeWebHooks,
  makeDingDingRobotHook: makeDingDingRobotHook
}

function fire(url, secret, payload) {
  var hmac = secret && crypto.createHmac('sha1', secret)
    , body = {payload: JSON.stringify(payload)}
    , signature = 'sha1='
  if (secret) {
    hmac.update(qs.stringify(body).toString('utf8'))
    signature += hmac.digest('hex')
  }
  var req = request.post(url)
  if (secret) {
    req = req.set('x-hub-signature', signature)
  }
  req.send(body)
  req.end(function (err, req){
    if(err){
      console.error('failed to fire webhook', err);
    }
    else if (req.status >= 300 || req.status < 100) {
      console.error('failed to fire webhook', req.status, req.text, url, secret, payload)
    }
  })
}

var DEFAULT_FORMAT = {
  // job data
  project: 'job.project.name',
  commit_id: 'job.ref.id',
  branch: 'job.ref.branch',
  repo_url: 'job.project.provider.config.url',
  // results
  test_exitcode: 'data.exitCode',
  finish_time: 'data.time'
}

function crawlTree(obj, fn) {
  var res = {}
  for (var key in obj) {
    if ('object' === typeof obj[key]) {
      res[key] = crawlTree(obj[key])
    } else {
      res[key] = fn(obj[key])
    }
  }
  return res
}

function getHookValue(data, job, key) {
  if ('string' !== typeof key) return key
  var parts = key.split('.')
  if (['data', 'job'].indexOf(parts[0]) === -1) return key
  return parts.reduce(function (obj, part) {
    return obj ? obj[part] : obj
  }, { data: data, job: job })
}

function makeHook(format, job) {
  try {
    format = JSON.parse(format)
  } catch(err) {
    format = DEFAULT_FORMAT
  }
  return function (data, job) {
    return crawlTree(format, getHookValue.bind(null, data, job))
  }
}

function makeWebHooks(hooks, job) {
  if (!hooks) return []
  var hook
  for (var i=0; i<hooks.length; i++) {
    hook = hooks[i]
    hook.prepare = makeHook(hook.format, job)
  }
  return hooks
}

function makeDingDingRobotHook(data, job) {
  var dingdingContent;  
  let regResult = job.trigger.message.match(/\s?\d{11,}/);
  let jobMessage = job.trigger.message.slice(0, regResult.index)
  let mobile = regResult && regResult[0].trim();
  let atMobiles = [].concat(mobile);
  if(data.exitCode == 0) {
    dingdingContent = `${jobMessage} ${job.project.name}:${job.ref.branch} ${job.type} is finished at ${data.time}，test_exitcode: ${data.exitCode}`;
  }
  else {
    dingdingContent = `${jobMessage} ${job.project.name}:${job.ref.branch} ${job.type} was failed at ${data.time}，error message: test error`;
  }
  return {
    "msgtype": "text",
    "text": {
      "content": dingdingContent
    },
    "at": {
      "isAtAll": false,
      "atMobiles": atMobiles
    }
  }
}
