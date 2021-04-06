import Vue from 'vue';
import Vuex from 'vuex';
// import authModule from './auth';
import layoutModule from './layout';
import buysellModule from './buysell';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // auth: authModule,
    layout: layoutModule,
    buysell: buysellModule,
  },
});