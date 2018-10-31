const digitalocean = require('digitalocean');
const client = digitalocean.client(process.env.DIGITAL_OCEAN_TOKEN);
const fs = require('fs');
const fetch = require('node-fetch');
const { exec } = require('child_process');
const pexec = promisify(exec);

const DOMAIN = 'commontheory.io';
const NAME = '@';

(async () => {
  try {
    const daemon = exec('ipfs init && ipfs daemon');
    const hash = (await pexec('sleep 10 && ipfs add -r ./static -Q')).replace(/\s/g, '');
    console.log(`Added static dir at ${hash}`);
    const domains = await client.domains.list();
    const records = await client.domains.listRecords(DOMAIN);
    const dnslinkRecord = records.find(record => {
      if (record.type !== 'TXT') return false;
      if (record.data.indexOf('dnslink=') === -1) return false;
      if (record.name !== NAME) return false;
      return record;
    });
    if (!dnslinkRecord) {
      console.log('Unable to find dnslink record!');
      process.exit(1);
    }
    await client.domains.updateRecord(DOMAIN, dnslinkRecord.id, {
      data: `dnslink=/ipfs/${hash}`
    });
    console.log('DNS record updated')
    // Pull the file across the ipfs servers so it's available for at least a bit
    await fetch(`https://ipfs.io/ipfs/${hash}`);
    const msWait = 60 * 10 * 1000;
    console.log(`Waiting ${msWait / 1000} seconds before spinning down.`);
    setTimeout(() => process.exit(0), msWait);
  } catch (err) {
    console.log(err);
  }
})();

function promisify(fn) {
  return (...args) => {
    return new Promise((rs, rj) => {
      fn(...args, (err, ..._args) => {
        if (err) return rj(err);
        rs(..._args);
      });
    });
  };
}
