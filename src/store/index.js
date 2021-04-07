import Vue from 'vue';
import Vuex from 'vuex';
import layoutModule from './layout';
import buysellModule from './buysell';
import searchbarModule from './searchbar';
import overviewModule from './overview';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout: layoutModule,
    buysell: buysellModule,
    searchbar: searchbarModule,
    overview: overviewModule,
  },
});