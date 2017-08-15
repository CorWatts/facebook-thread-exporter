#!/usr/bin/env node

/*
 * Go to https://developers.facebook.com/tools/explorer/
 * Change api version dropdown to 2.3
 * Click 'Get Token' -> 'Get User Access Token'
 * Ensure the read_mailbox permission is enabled
 * Click 'Get Access Token'
 * Copy and paste the access token into this script
 *
 * TODO: How does one find the thread id???
 */

const ndjson   = require('ndjson')
const fs        = require('fs')
const yargs    = require('yargs')
                   .option('thread-id', { describe: 'The thread_id of your facebook thread', alias: 'i' })
                   .option('access-token', {describe: 'Your Facebook access_token', alias: 't' })
                   .option('file', {describe: 'The output file name', default: 'thread.json', alias: 'f' })
                   .demandOption(['thread-id', 'access-token'], 'Please provide both thread-id and access-token arguments')
                   .help()
                   .argv
const file     = yargs.file

const download = require('./lib/download')

let options = {
  uri: "https://graph.facebook.com/v2.3/"+yargs['thread-id']+"/comments",
  qs: {
    access_token: yargs['access-token'],
    limit: 30,
    method: 'get'
  },
  json: true
}

download(options)
  .pipe(ndjson.stringify())
  .pipe(fs.createWriteStream(file, {encoding: 'utf8', autoClose: false}))
  .on('finish', () => console.log('Stream closed. All done.'))
  .on('error', (e) => console.log(`Errored: ${e.message}`))
