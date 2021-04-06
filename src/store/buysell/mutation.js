import type from './type'

const mutations = {
    [type.SET_CURRENT_TOKEN] (state, data) {
        state.current_token = data;
    },
    [type.SET_CURRENT_PAIR] (state, data) {
        state.current_pair = data;
    },
};
export default mutations;