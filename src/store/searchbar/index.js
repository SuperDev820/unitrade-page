import mutations from './mutation'
import actions from './action'
import getters from './getter'

const defaultState = {
  found_tokenList: [],
  recent_tokenList: [],
  trend_tokenList: [],
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
