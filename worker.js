var utils = require('./lib/utils')
var request = require('./lib/request');

module.exports = {
  // run for each job
  init: function (config, job, context, cb) {
    var hooks = utils.makeWebHooks(config || [], job)
    cb(null, {
      listen: function (io, context) {
        function onTested(id, data) {
          io.removeListener('job.status.tested', onTested)
          Object.keys(hooks).forEach(function (k) {
            var hook = hooks[k]
            context.comment('Firing webhook ' + hook.title)
            try {
              var payload = utils.makeDingDingRobotHook(data, job)
              request(hook.url, payload)
              // io.emit('plugin.webhooks.fire', hook.url, hook.secret, payload)
            } catch (e) {
              context.comment('Failed to prepare webhook payload: ' + e.message);
              return
            }
          })
        }

        io.on('job.status.tested', onTested)
      }
    })
  }
}
