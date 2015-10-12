var path = require('path')
var test = require('tape')
var testPackages = require('standard-packages/test')
var gitEmAll = require('../')

test('run against standard repos', function (t) {
  var dest = path.join(__dirname, 'repos')

  var repos = testPackages.map(function (pkg) {
    return pkg.repo
  })

  gitEmAll({repos: repos, dest: dest}, function (err) {
    t.error(err)
    t.end()
  })
})
