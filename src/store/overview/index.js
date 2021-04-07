import mutations from './mutation'
import actions from './action'
import getters from './getter'

const defaultState = {
  overview_rows: [
    {
      date: '4/6/2021',
      type: 'Market',
      buy_sell: 'Buy',
      from: 'ETH',
      from_amount: 0,
      to: 'Trade',
      to_amount: 0,
      status: 'pending',
    },
    {
      date: '4/6/2021',
      type: 'Limit',
      buy_sell: 'Sell',
      from: 'BTC',
      from_amount: 0,
      to: 'Trade',
      to_amount: 0,
      status: 'cancel',
    },
  ],
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
