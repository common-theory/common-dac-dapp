#/bin/sh

# Intended to be run in a CI environment
if [ -z "$CI" ];
then
  echo 'Non-ci environment detected, exiting'
  exit 1
fi

npm run build:production
npm i -g cidhook ipfs
jsipfs init
jsipfs daemon &
sleep 10
# Unpin the old version
cidhook cidhook.commontheory.io $(jsipfs dns commontheory.io) unpin
# Pin the new version
cidhook cidhook.commontheory.io $(jsipfs add -Qr ./static)
# Update the DNS record
npx dnslink update commontheory.io $(jsipfs add -Qr ./static)
