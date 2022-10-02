# Facebook Thread Exporter

This repo and code is now deprecated. It relied on a part of Facebook's API that was removed long ago.

## Usage
```
Options:
  --thread-id     The thread_id of your facebook thread               [required]
  --access-token  Your Facebook access_token                          [required]
  --file          The output file name                  [default: "thread.json"]
  --help          Show help                                            [boolean]
```

## Instructions
1. Go to https://developers.facebook.com/tools/explorer/
1. Change api version dropdown to 2.3
1. Click 'Get Token' -> 'Get User Access Token'
1. Ensure the read_mailbox permission is enabled
1. Click 'Get Access Token'
1. Copy and paste the access token into this script

**TODO:** How does one find the thread id???
