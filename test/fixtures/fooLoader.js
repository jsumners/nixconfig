'use strict'

const fs = require('fs')

module.exports = {
  '.foo': function (file) {
    return fs.readFileSync(file)
  }
}
