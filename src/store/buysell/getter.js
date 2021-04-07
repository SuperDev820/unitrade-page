const getters = {
    currentToken(state) {
        return state.current_token
    },
    currentPair(state) {
        return state.current_pair
    },
    tokenItems(state) {
        return state.token_items
    },
};

export default getters;