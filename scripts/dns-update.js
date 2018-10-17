const digitalocean = require('digitalocean');
const client = digitalocean.client(process.env.DIGITAL_OCEAN_TOKEN);
const IPFS = require('ipfs');
const node = new IPFS();
const fs = require('fs');
const fetch = require('node-fetch');

const DOMAIN = 'commontheory.io';
const NAME = '@';

node.on('ready', async () => {
  try {
    const [file] = await node.files.add(fs.readFileSync('./static/index.html'));
    console.log(`Added file ${file.path}, ${file.size / 1024} KB`);
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
      data: `dnslink=/ipfs/${file.hash}`
    });
    console.log('DNS record updated')
    // Pull the file across the ipfs servers so it's available for at least a bit
    await fetch(`http://ipfs.io/ipfs/${file.hash}`);
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
});
