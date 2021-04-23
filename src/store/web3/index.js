import mutations from './mutation'
import actions from './action'
import getters from './getter'

export const defaultState = {
  web3: {
    isInjected: localStorage.getItem('isInjected') ? localStorage.getItem('isInjected') : false,
    walletType: localStorage.getItem('walletType') ? localStorage.getItem('walletType') : 0,
    ethProvider:null,
    web3Instance: null,
    address: null,    
    networkId: null,
  },
  contractInstance: null
}

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
