import type from './type'
// import axios from "axios";

const actions = {
    setTrendTokens(context, data) {
        context.commit(type.SET_TREND_TOKENS, data);
    },
    
    setRecentTokens(context, data) {
        context.commit(type.SET_RECENT_TOKENS, data);
    },
    
    setFoundTokens(context, data) {
        context.commit(type.SET_FOUND_TOKENS, data);
    },
};

export default actions;