'use strict'

module.exports = function getPathValue (instance, key) {
  const path = key.split(instance.delim)
  let curObj = instance.config[path[0]]
  for (let i = 1; i < path.length; i += 1) {
    if (curObj === null || curObj === undefined) break
    curObj = curObj[path[i]]
  }
  return curObj
}
