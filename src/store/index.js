import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: {},
    loader: false,
  },
  getters: {
    token: state => state.token,
    user: state => state.user,
    loader: state => state.loader,
  },
  mutations: {
    SET_LOADER (state, status) {
      state.loader = status
    },
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_USER (state, user) {
      state.user = user
    },
    RESET_STATE (state) {
      state.token = null
      state.user = {}
    },
  },
  actions: {
    setToken({commit}, status) {
      commit('SET_TOKEN', status);
    },
    setUser({commit}, status) {
      commit('SET_USER', status);
    },
    setStatusLoader({commit}, status) {
      commit('SET_LOADER', status);
    },
    logout({ commit }) {
      commit('RESET_STATE');
    },
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
