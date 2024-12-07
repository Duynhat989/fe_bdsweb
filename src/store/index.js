import { createStore } from 'vuex';
import { login, register, forgetPassword, confirmPassword } from '../api/auth';

const store = createStore({
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isLogin: !!localStorage.getItem('token') ,
        message: "",
        assistantName: ""
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        setToken(state, token) {
            state.token = token;
            state.isLogin = !!token;
            localStorage.setItem('token', token);
        },
        clearAuthData(state) {
            state.user = null;
            state.token = null;
            state.isLogin = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setMessage(state, message) {
            state.message = message;
        },
        setAssistantName(state, assistantName) {
            state.assistantName = assistantName;
        },
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
            commit('clearAuthData');
        },
        async forgetPassword({ commit }, email) {
            try {
                await forgetPassword( email );
            } catch (error) {
                commit('setMessage', 'Có lỗi xảy ra khi gửi yêu cầu quên mật khẩu.');
            }
        },
        async confirmPassword({ commit }, { code, email, new_password }) {
            try {
                const data = await confirmPassword({ code, email,new_password });
                commit('setMessage', data.message);
            } catch (error) {
                commit('setMessage', 'Có lỗi xảy ra khi đặt lại mật khẩu.');
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        getUser(state) {
            return state.user;
        },
        isLogin(state) {
            return state.isLogin; 
        }
    }
});

export default store;
