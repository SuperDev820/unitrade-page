import type from './type'

const mutations = {
    [type.SET_WEB3] (state, data) {
        state.web3 = data;
        localStorage.setItem('isInjected', data.isInjected)
        localStorage.setItem('walletType', data.walletType)
    },
    [type.SET_CONTRACT] (state, data) {
        state.contractInstance = data;
    },
};
export default mutations;