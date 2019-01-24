#/bin/sh

set -e

# Load from .env
set -o allexport
[ -f .env ] && source .env
set +o allexport

# Build the web app in ./static
npm run build:production

# Ensure jsipfs executable is present
which jsipfs > /dev/null

# Start a local IPFS node
jsipfs daemon &
JSPID=$!

sleep 10
# Check that the process is up
ps -ax | grep $JSPID | grep -v grep > /dev/null

DOMAIN=commontheory.io
CIDHOOKD_URL=cidhookd.commontheory.io

# Load the old CID based on the current dnslinked value
OLD_CID=$(npx dnslink resolve $DOMAIN)

# Load the new CID by adding it to the local IPFS node
NEW_CID=$(jsipfs add -Qr ./static)

# Unpin the old version
npx cidhook $CIDHOOKD_URL $OLD_CID unpin

# Pin the new version
npx cidhook $CIDHOOKD_URL $NEW_CID

# Update the DNS record
npx dnslink update $DOMAIN $NEW_CID

curl $DOMAIN > /dev/null 2> /dev/null

kill $JSPID
