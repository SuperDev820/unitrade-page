import mutations from './mutation'
import actions from './action'
import getters from './getter'

const ORDER_TYPE = {
  LIMIT: 0,
  MARKET: 1,
};

const SWAP_TYPE = {
  T2T: 0,
  E2T: 1,
  T2E: 2,
};

const BUY_TYPE = {
  BUY: 0,
  SELL: 1,
}
//console.log(jsonData)
export const defaultState = {
  mode: {
    order_type: ORDER_TYPE.LIMIT,
    swap_type: SWAP_TYPE.E2T,
    buy_sell: BUY_TYPE.BUY,
    manual_price: 0,
  },
  gasfee_options: [],
  current_token0: {
    token: {
      id: "",
      address: "",
      symbol: "",
      name: "",
      priceETH: 0,
      priceUSD: 0,
    },
    balance: 0,
    amount: 0,
  },

  current_token1: {
    token: {
      //"0xdAC17F958D2ee523a2206206994597C13D831ec7",
      id: "",
      address: "",
      symbol: "",
      name: "",
      priceETH: 0,
      priceUSD: 0,
    },
    balance: 0,
    amount: 0,
  },

  pair_tokenList: [
  ],
  eth_price: 0,
}

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
