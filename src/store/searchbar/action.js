
import type from './type'

const actions = {
    setRecentPairs(context, data) {
        // console.log(token)
        context.commit(type.SET_RECENT_PAIRS, data);
    },
};

export default actions;