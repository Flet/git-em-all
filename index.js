module.exports = getEmAll
var sh = require('shelljs')
var dezalgo = require('dezalgo')
var path = require('path')
var parallelLimit = require('run-parallel-limit')
var os = require('os')
var PARALLEL_MAX = Math.min(os.cpus().length * 1.5)

function getEmAll (opts, callback) {
  callback = dezalgo(callback)

  if (!sh.which('git')) {
    return callback(new Error('Sorry, this script requires git'))
  }

  // TODO: error check
  sh.mkdir('-p', opts.dest)

  var totalRepos = 0
  var repoCloneFuncs = opts.repos.map(function (repo) {
    var currentRepoNum = ++totalRepos
    return function (cb) {
      console.log('(' + currentRepoNum + '/' + totalRepos + ') Cloning ' + repo)
      var name = repo.split(/\\|\//).pop()
      pullOrClone(repo, path.join(opts.dest, name), cb)
    }
  })

  // TODO: silent flag
  console.log('Cloning/Pulling ' + totalRepos + ' repositories. (max parallel: ' + PARALLEL_MAX + ')')
  parallelLimit(repoCloneFuncs, PARALLEL_MAX, function (err) {
    if (err) return callback(err)
    return callback(null)
  })
}

function pullOrClone (repo, dir, cb) {
  if (sh.test('-d', dir)) {
    sh.exec('git -C ' + dir + ' pull', {silent: true}, cb)
  } else {
    sh.exec('git clone --depth 1 ' + repo + ' ' + dir, {silent: true}, cb)
  }
}
