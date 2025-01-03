<script setup>
import { ref } from 'vue'
import store from '@/store';
import { useRouter } from 'vue-router';
import useNotification from '@/composables/useNotification';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const notification = useNotification();
const isPasswordVisible = ref(false);

const isLoading = ref(false);
const emit = defineEmits(['switchToForgotPassword']);

const switchToForgotPassword = () => {
    emit('switchToForgotPassword');
};
const handleLogin = async ({ email, password }) => {
    try {
        await store.dispatch('login', { email, password });
    } catch (error) {
        notification.error('Lỗi!', ` Đăng nhập không thành công! Lỗi ${error}`, {
            showActions: false
        })
    }
};
const handleRegister = async (event) => {
    isLoading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await store.dispatch('register', { name: name.value, email: email.value, password: password.value, phone: phone.value });
        await handleLogin({ email: email.value, password: password.value });
        const intendedRoute = localStorage.getItem('intendedRoute');
        if (intendedRoute) {
            router.push(intendedRoute);
            localStorage.removeItem('intendedRoute');
        } else {
            router.push('/assistant');
        }
        notification.success('Thành công!', 'Bạn đã đăng ký thành công!', {
            showActions: false
        })
    } catch (error) {
        notification.error('Lỗi!', ` Đăng nhập không thành công! Lỗi ${error}`, {
            showActions: false
        })
    } finally {
        isLoading.value = false;
    }
};
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>
<template>
    <form class="form" @submit.prevent="handleRegister">
        <input type="text" v-model="name" placeholder="Tên đăng nhập" required autocomplete="username"/>
        <input type="email" v-model="email" placeholder="Email" required autocomplete="email"/>
        <input type="text" v-model="phone" placeholder="Nhập  số điện thoại" required autocomplete="tel"/>
        <div class="password-container">
            <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password"  autocomplete="new-password"  placeholder="Mật khẩu" required />
            <span class="toggle-password" @click="togglePasswordVisibility">
                <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                </svg>
            </span>
        </div>
        <button type="submit" :disabled="isLoading">
            <span v-if="isLoading">
                <svg style="margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                        opacity="0.5" />
                    <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                        <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                            to="360 12 12" type="rotate" />
                    </path>
                </svg>
                Đăng đăng ký ...</span>
            <span v-else>Đăng ký</span>
        </button>
        <span class="forgot-password" @click="switchToForgotPassword">Quên mật khẩu</span>
        <div class="tertiary"> Khi đăng ký là bạn đã đồng ý với
            <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai">
                Điều khoản sử dụng
            </a>,
            <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai/loi-cam-on/publish-your-docs-1">
                Chính  sách  miễn  trừ  trách  nhiệm
            </a>,
            <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai">
                Chính sách bảo mật
            </a>,
            <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai">
                Quy chế
            </a>,
            <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai" class="sc-ksXhwv yKtqX">
                Chính sách
            </a> của chúng tôi.
        </div>
    </form>
</template>
<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.password-container {
    position: relative;
}

.toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.password-container input {
    width: 100%;
}

input {
    padding: 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 15px;
    font-size: 16px;
    background: var(--color-primary);
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) 35%, rgba(44, 44, 44, 1) 100%);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    opacity: 0.8;
}

.forgot-password {
    color: #007bff;
    cursor: pointer;
    text-align: center;
}

.forgot-password:hover {
    text-decoration: underline;
}

.tertiary {
    text-align: center;
    font-size: 15px;
}

.tertiary a {
    display: inline-block;
    color: #007bff;
}
</style>