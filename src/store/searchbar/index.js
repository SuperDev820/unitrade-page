import mutations from './mutation'
import actions from './action'
import getters from './getter'

const defaultState = {
  recent_pairs: [],
  trending_pairs: [
    {
      name: 'XML',
      description: 'xml.network',
      liquidity: 0,
    },
  ],
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
