import mutations from './mutation'
import actions from './action'
import getters from './getter'

const defaultState = {
  current_token: {
    name: 'ETH',
    description: 'Ethereum',
    liquidity: 0,
  },
  current_pair: {
    name: 'XML',
    description: 'xml.network',
    liquidity: 0,
  },
  token_items: [
    {
      'name': 'ETH',
      'description': 'Ethereum',
      'liquidity': 30502411.56,
    },
  ],
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
