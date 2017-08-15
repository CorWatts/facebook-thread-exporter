const sleep     = require('sleep').sleep
const request   = require('request-promise')
const ndjson    = require('ndjson')
const through2  = require('through2')
const objStream = through2.obj((chunk, enc, cb) => cb(null, chunk))

module.exports = function download(opts, stream = objStream) {
  request(opts)
    .then(({data, paging:{next}}) => {
      if(data && data.length > 0) {
        data.map(stream.push)
        console.log("SUCCESS: "+opts.uri)
        sleep(1)
        download(Object.assign({}, opts, {uri: next}), stream)
      } else {
        stream.end()
        console.log("FAILURE: "+opts.uri)
      }
    })
    .catch(err => {
      stream.end()
      console.log('ERROR: ', err)
    })
  return stream
}
