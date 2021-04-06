
import type from './type'

const actions = {
    setToken(context, data) {
        // console.log(token)
        context.commit(type.SET_CURRENT_TOKEN, data);
    },
    setPair(context, data) {
        // console.log(token)
        context.commit(type.SET_CURRENT_PAIR, data);
    },
};

export default actions;