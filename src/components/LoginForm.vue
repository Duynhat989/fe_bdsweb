<script setup>
import { ref } from 'vue'
import store from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const isLoading = ref(false);

const handleLogin = async (event) => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await store.dispatch('login', { email: email.value, password: password.value });
    router.push('/assistant');
  } catch (error) {
    errorMessage.value = error.message || 'Đăng nhập thất bại, vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
}

</script>
<template>
  <form class="form" @submit.prevent="handleLogin">
    <input type="text" v-model="email" placeholder="Tài khoản" required />
    <input type="password" v-model="password" placeholder="Mật khẩu" required />
    <button type="submit" :disabled="isLoading">
      <span v-if="isLoading"><i class='bx bx-loader-circle'></i> Đăng đăng nhâp ...</span>
      <span v-else>Đăng nhập</span>
    </button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  font-size: 16px;
  background: rgb(229, 57, 53);
  background: linear-gradient(90deg, rgba(229, 57, 53, 1) 0%, rgba(229, 57, 53, 1) 35%, rgba(44, 44, 44, 1) 100%);
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
</style>