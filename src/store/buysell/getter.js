const getters = {
    currentToken0(state) {
        return state.current_token0
    },
    currentToken1(state) {
        return state.current_token1
    },
    currentMode(state) {
        return state.mode
    },
    
    pairTokenList(state) {
        return state.pair_tokenList;
    },
    ethPrice(state) {
        return state.eth_price;
    },
    gasFeeOptions(state) {
        return state.gasfee_options;
    },

};

export default getters;