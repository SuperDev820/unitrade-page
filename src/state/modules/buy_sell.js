export const state = {
    current_token: {
        name: 'ETH',
        description: 'Ethereum',
        liquidity: 0,
    },
}

export const getters = {
    currentToken(state) {
        return state.current_token
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
