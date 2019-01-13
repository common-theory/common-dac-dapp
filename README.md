# common-dapp [![Build Status](https://travis-ci.org/common-theory/common-dapp.svg?branch=master)](https://travis-ci.org/common-theory/common-dapp) [![latest hash](https://dnslink-cid-badge.commontheory.io/commontheory.io)](https://commontheory.io)

This is a web interface for interacting with the common theory [`contracts`](https://github.com/common-theory/contracts). The app is deployed to IPFS and accessible at the following places:

- [`https://commontheory.io`](https://commontheory.io)
- [`https://ipfs.io/ipns/commontheory.io`](https://ipfs.io/ipns/commontheory.io)
- [![latest hash](https://dnslink-cid-badge.commontheory.io/commontheory.io)](https://dnslink-cid-badge.commontheory.io/commontheory.io?redirect=true)

## Deployment System

When code is pushed to this repo a continuous integration (CI) [build](https://travis-ci.org/common-theory/common-dapp) is triggered. This build will do the following:

- compile the web app
- deploy the files to an IPFS node on the CI machine
- use [`cidhook`](https://github.com/jchancehud/cidhook) to pull the files across the IPFS network to a persistent node
- update `commontheory.io` [dnslink](https://docs.ipfs.io/guides/concepts/dnslink/) record

This updates the deployed version of the website at [`commontheory.io`](https://commontheory.io).
