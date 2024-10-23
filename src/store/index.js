import { createStore } from 'vuex';
import { login, register, logout } from '../api/auth';

const store = createStore({
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        clearAuthData(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
    actions: {
        async login({ commit }, credentials) {
            const data = await login(credentials);

            commit('setUser', data.data);
            commit('setToken', data.data.token);
        },
        async register({ commit }, credentials) {
            const data = await register(credentials);
            commit('setUser', data.data);
            commit('setToken', data.data.token);
        },
        async logout({ commit }) {
            await logout();
            commit('clearAuthData');
        }
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        getUser(state) {
            return state.user;
        }
    }
});

export default store;
