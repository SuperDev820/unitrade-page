
import type from './type'

const actions = {
    changeLayoutType({ commit }, { layoutType }) {
        commit(type.CHANGE_LAYOUT, layoutType);
    },
};


export default actions;