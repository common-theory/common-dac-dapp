#! /bin/sh

set -e

mkdir ./build || echo "Build directory present"
rm -f ./build/CommonDAC.sol
wget -O ./build/CommonDAC.sol https://raw.githubusercontent.com/common-theory/common-dac/master/contracts/CommonDAC.sol

# Can't seem to control the abi output filename so just wipe the build dir
rm -rf ./build/*.abi
solcjs --abi -o ./build ./build/CommonDAC.sol
mv ./build/*.abi ./CommonDAC.abi.json
