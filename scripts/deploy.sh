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

export IPFS_PATH=$(mktemp -u)

# Start a local IPFS node
jsipfs init
jsipfs daemon &
JSPID=$!

# Wait for ipfs node to spin up
sleep 10

# Check that the process is up
ps -ax | grep $JSPID | grep -v grep > /dev/null

DOMAIN=commontheory.io
CIDHOOKD_URL=cidhookd.commontheory.io

# Load the old CID based on the current dnslinked value
OLD_CID=$(npx dnslink resolve $DOMAIN)

# Load the new CID by adding it to the local IPFS node
NEW_CID=$(jsipfs add -Qr ./static)

# Pin the new version
npx cidhook pin $NEW_CID -s $CIDHOOKD_URL

# Don't unpin if the current version is up to date
if [ $OLD_CID = $NEW_CID ];
then
  echo "DNS record already up to date"
  kill $JSPID
  exit 0
fi

# Unpin the old version
npx cidhook unpin $OLD_CID -s $CIDHOOKD_URL

# Update the DNS record
npx dnslink update $DOMAIN $NEW_CID

# Pull the domain over http
curl $DOMAIN > /dev/null 2> /dev/null

kill $JSPID
