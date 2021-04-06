import type from './type'

const mutations = {
    [type.CHANGE_LAYOUT] (state, layoutType) {
        state.layoutType = layoutType;
    },
};
export default mutations;