import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    defaultFontSize: 16,
  },
  mutations: {
    setFontSize(state, fontSize){
      state.defaultFontSize = fontSize
    }
  },
  actions: {

  }
});
