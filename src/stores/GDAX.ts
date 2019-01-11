import { observable } from 'mobx';

export default class GDAXStore {

  @observable ethPrice: number;

  constructor() {
    this.loadEthPrice();
  }

  async loadEthPrice() {
    const response = await fetch('https://api.coinbase.com/v2/exchange-rates');
    const json = await response.json();
    const ETH_USD_RATE = json.data.rates.ETH;
    const USD_ETH_RATE = Math.round(1e2 / ETH_USD_RATE) / 1e2;
    this.ethPrice = USD_ETH_RATE;
  }

}
