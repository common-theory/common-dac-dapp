#/bin/sh

set -e

# Intended to be run in a CI environment
if [ -z "$CI" ];
then
  echo 'Non-ci environment detected, exiting'
  exit 1
fi

# Build the web app in ./static
npm run build:production

# Install jsipfs
npm i -g ipfs cidhook dnslink

# Start a local IPFS node
jsipfs init
jsipfs daemon &
sleep 10

# Load the old CID based on the current dnslinked value
OLD_CID=$(jsipfs dns commontheory.io)

# Load the new CID by adding it to the local IPFS node
NEW_CID=$(jsipfs add -Qr ./static)

echo $CIDHOOK_SECRET
# Unpin the old version
cidhook cidhookd.commontheory.io $OLD_CID unpin

# Pin the new version
cidhook cidhookd.commontheory.io $NEW_CID

# Update the DNS record
dnslink update commontheory.io $NEW_CID
