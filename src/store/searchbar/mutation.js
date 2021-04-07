import type from './type'

const mutations = {
    [type.SET_RECENT_PAIRS] (state, data) {
        state.recent_pairs = data;
    },
};
export default mutations;