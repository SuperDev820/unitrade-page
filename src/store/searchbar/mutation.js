import type from './type'

const mutations = {
    [type.SET_TREND_TOKENS] (state, data) {
        state.trend_tokenList = data;
    },
    [type.SET_RECENT_TOKENS] (state, data) {
        state.recent_tokenList = data;
    },
    [type.SET_FOUND_TOKENS] (state, data) {
        state.found_tokenList = data;
    },
};
export default mutations;