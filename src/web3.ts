import Web3 from 'web3';
/**
 * Initialize a global web3 from metamask or from a fallback source.
 **/
if (typeof web3 !== 'undefined') {
  global.web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  console.log('Consider installing metamask!');
  global.web3 = new Web3(new Web3.providers.HttpProvider('https://homestead.commontheory.io'));
}

if (window.ethereum) {
  // Request permission from metamask if present
  window.ethereum.enable();
}
