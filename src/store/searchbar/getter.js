const getters = {
    recentTokenList(state) {
        return state.recent_tokenList;
    },
    trendTokenList(state) {
        return state.trend_tokenList;
    },
    foundTokenList(state) {
        return state.found_tokenList;
    },
};

export default getters;