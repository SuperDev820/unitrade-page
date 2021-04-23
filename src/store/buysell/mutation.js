import type from './type'

const mutations = {
    [type.SET_CURRENT_TOKEN0] (state, data) {
        state.current_token0 = data;
    },
    [type.SET_CURRENT_TOKEN1] (state, data) {
        state.current_token1 = data;
    },
    [type.SET_CURRENT_MODE] (state, data) {
        state.mode = data;
    },
    // [type.SET_PAIR_TOKENS] (state, data) {
    //     state.pair_tokenList = data;
    // },    
    [type.SET_ETH_PRICE] (state, data) {
        state.eth_price = data;
    },    
    [type.SET_GAS_FEE_OPTIONS] (state, data) {
        state.gasfee_options = data;
    },
};
export default mutations;