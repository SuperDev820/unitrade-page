
const ORDER_LIMIT = 0;
const ORDER_MARKET = 1;

const SWAP_T2T = 0;
const SWAP_E2T = 1;
const SWAP_T2E = 2;

const SWAP_BUY = 0;
const SWAP_SELL = 1;

export const state = {
    mode:{
        order_type: SWAP_E2T,
        swap_type: SWAP_E2T,
        buy_sell: SWAP_BUY,
        manual_price: 0,
    },
    
    current_token0: {
        name: 'ETH',
        description: 'Ethereum',
        price: 0,
        balance:0,
        amount:0,
    },
    
    current_token1: {
        name: 'USDT',
        description: 'Tether',
        price: 0,
        balance:0,
        amount:0,
    },
}

export const getters = {
    currentToken0(state) {
        return state.current_token0
    },
    currentToken1(state) {
        return state.current_token1
    },
    currentMode(state) {
        return state.mode
    },
}

export const mutations = {
    SET_CURRENT_TOKEN(state, token) {
        state.current_token = token;
    },
}

export const actions = {
    // eslint-disable-next-line no-unused-vars
    selectToken({ commit, state, rootState }, { token }) {
        commit('SET_CURRENT_TOKEN', token);
    },
}
