const getters = {
    recentPairs(state) {
        return state.recent_pairs
    },
    trendingPairs(state) {
        return state.trending_pairs
    },
};

export default getters;