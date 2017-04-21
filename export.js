#!/bin/env node

/*
 * Go to https://developers.facebook.com/tools/explorer/
 * Change api version dropdown to 2.3
 * Click 'Get Token' -> 'Get User Access Token'
 * Ensure the read_mailbox permission is enabled
 * Click 'Get Access Token'
 * Copy and paste the access token into this script
 *
 * TODO: How does one find the thread id???
 *
 */

const fs      = require('fs')
const sleep   = require('sleep').sleep
const request = require('request-promise')
const yargs   = require('yargs')
                  .option('thread-id', { describe: 'The thread_id of your facebook thread', alias: 'i' })
                  .option('access-token', {describe: 'Your Facebook access_token', alias: 't' })
                  .option('file', {describe: 'The output file name', default: 'thread.json', alias: 'f' })
                  .demandOption(['thread-id', 'access-token'], 'Please provide both thread-id and access-token arguments')
                  .help()
                  .argv
const file  = yargs.file

let thread  = []
let options = {
  uri: "https://graph.facebook.com/v2.3/"+yargs['thread-id']+"/comments",
  qs: {
    access_token: yargs['access-token'],
    limit: 30,
    method: 'get'
  },
  json: true
}

write(fbGet(options))


function fbGet(opts, accum=[]) {
  request(opts)
    .then(res => {
      if(res && res.data && res.data && res.data.length > 0) {
        console.log("SUCCESS: "+opts.uri)
        sleep(1)
        return fbGet(_.merge(opts, {uri: res.paging.next}), accum.push(...res.data))
      } else {
        console.log("FAILURE: "+opts.uri)
        console.log("WE'RE ALL DONE")
        return []
      }
    })
    .catch(err => {
      console.log(err)
      return accum
    })
}

function write(json) {
  fs.writeFileSync(file, JSON.stringify(thread), 'utf8')
}
