<script setup>
import { ref } from 'vue'
import store from '@/store';
import { useRouter } from 'vue-router';
import useNotification from '@/composables/useNotification';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';
const notification = useNotification();

const router = useRouter();

const email = ref('');
const password = ref('');
const license = ref({});

const isLoading = ref(false);
const isPasswordVisible = ref(false);

const emit = defineEmits(['switchToForgotPassword']);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const switchToForgotPassword = () => {
  emit('switchToForgotPassword');
};
const fetchLicense = async () => {
  try {
    const response = await request.get(END_POINT.LICENSE_GET);
    license.value = response.license;

    localStorage.setItem('license', JSON.stringify(response.license));
  } catch (error) {
    console.error('Lỗi lấy thông tin gói:', error);
    notification.error('Lỗi!', 'Không thể lấy thông tin gói. Vui lòng thử lại!', {
      showActions: false,
    });
  }
};
const handleLogin = async (event) => {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await store.dispatch('login', { email: email.value, password: password.value });
    await fetchLicense();
    const intendedRoute = localStorage.getItem('intendedRoute');
    if (intendedRoute) {
      router.push(intendedRoute);
      localStorage.removeItem('intendedRoute');
    } else {
      router.push('/assistant');
    }
    notification.success('Thành công!', 'Đăng nhập thành công!', {
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

</script>
<template>
  <form class="form" @submit.prevent="handleLogin">
    <input type="text" v-model="email" placeholder="Tài khoản" required />
    <div class="password-container">
      <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" placeholder="Mật khẩu" required />
      <span class="toggle-password" @click="togglePasswordVisibility">
        <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
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
          <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
            opacity="0.5" />
          <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
            <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12"
              type="rotate" />
          </path>
        </svg>
        Đăng đăng nhâp ...</span>
      <span v-else>Đăng nhập</span>
    </button>
    <span class="forgot-password" @click="switchToForgotPassword">Quên mật khẩu</span>
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
  text-align: center;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.error {
  color: red;
}

.forgot-password {
  color: #007bff;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>