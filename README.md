# common-dac-dapp

This is a web interface for interacting with the [`common-dac`](https://github.com/common-theory/common-dac). The app is deployed to IPFS and accessible at the following places:

- [common-theory servers](https://commontheory.io)
- [IPFS servers](https://ipfs.io/ipns/commontheory.io)

## Current Deployment

Each push to the master branch triggers continuous integration that builds the app and uploads it to IPFS, updating domain TXT records for `commontheory.io` after.

The address is currently mapped to the following address:

// TODO: Make this dynamic

`/ipns/commontheory.io` -> `/ipfs/QmUpphC6w32RCMVZfPVcFUFkjt6GSgUmeCFRHGMYBRrYQj`
