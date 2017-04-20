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
                  .option('thread-id', { describe: 'The thread_id of your facebook thread'})
                  .option('access-token', {describe: 'Your Facebook access_token'})
                  .demandOption(['thread-id', 'access-token'], 'Please provide both thread-id and access-token arguments')
                  .help()
                  .argv
const file    = './thread.json'

var thread_id = yargs['thread-id']
var url = "https://graph.facebook.com/v2.3/"+thread_id+"/comments"
var thread = []
var options = {
  uri: url,
  qs: {
    access_token: yargs['access-token'],
    limit: 30,
    method: 'get'
  },
  json: true
}

fbGet(options)


function fbGet(opts) {
  request(opts)
    .then(res => {
      if(res && res.data && res.data && res.data.length > 0) {
        console.log("SUCCESS: "+opts.uri)
        thread.push(res.data)
        sleep(1)
        return fbGet({uri: res.paging.next, json: true})
      } else {
        console.log("FAILURE: "+opts.uri)
        console.log("WE'RE ALL DONE")
        fs.writeFileSync('thread.json', JSON.stringify(thread), 'utf8')
        return [];
      }
    })
    .catch(err => {
      fs.writeFileSync('thread.json', JSON.stringify(thread), 'utf8')
      console.log(err)
    })
}
