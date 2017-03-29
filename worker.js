var utils = require('./lib/utils')
var request = require('./lib/request');
var ws = require('./lib/ws');
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
          ws.emit('job.status.tested', {
            data: data,
            job: job
          })
        }


        function onQueued(id, data) {
          ws.emit('job.queued', {
            id: id,
            data: data,
            job: job
          })
        }
        function onErrored(id, data) {
          ws.emit('job.status.phase.errored', {
            id: id,
            data: data,
            job: job
          })
        }

        function onDeployed(id, data) {
          ws.emit('job.status.deployed', {
            id: id,
            data: data,
            job: job
          })
        }

        function onCancelled(data) {
          ws.emit('job.status.cancelled', {
            id: id,
            data: data,
            job: job
          })
        }
        function onPhaseDone(data) {
          ws.emit('job.status.phase.done', {
            id: id,
            data: data,
            job: job
          })
        }

        function onDone(data) {
          ws.emit('job.done', {
            id: id,
            data: data,
            job: job
          })
        }
        io.once('job.queued', onQueued);
        io.on('job.status.tested', onTested);
        io.once('job.status.phase.errored', onErrored);
        io.once('job.status.deployed', onDeployed);
        io.once('job.status.cancelled', onCancelled);
        io.once('job.status.phase.done', onPhaseDone);
        io.once('job.done', onDone);
      }
    })
  }
}
