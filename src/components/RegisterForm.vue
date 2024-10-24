<script setup>
import { ref } from 'vue'
import store from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const isLoading = ref(false);
const emit = defineEmits(['switchToForgotPassword']);

const switchToForgotPassword = () => {
    emit('switchToForgotPassword');
};
const handleRegister = async (event) => {
    errorMessage.value = '';
    isLoading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await store.dispatch('register', { name: name.value, email: email.value, password: password.value });
    } catch (error) {
        errorMessage.value = error.message || 'Đăng nhập thất bại, vui lòng thử lại.';
    } finally {
        isLoading.value = false;
    }
};
</script>
<template>
    <form class="form" @submit.prevent="handleRegister">
        <input type="text" v-model="name" placeholder="Tên đăng nhập" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Mật khẩu" required />
        <button type="submit" :disabled="isLoading">
            <span v-if="isLoading"><i class='bx bx-loader-circle'></i> Đăng đăng ký ...</span>
            <span v-else>Đăng ký</span>
        </button>
        <span class="forgot-password" @click="switchToForgotPassword">Quên mật khẩu</span>
        <div class="tertiary">Tiếp tục đăng ký, bạn đồng ý với
            <a href="https://trogiup.batdongsan.com.vn/docs/dieu-khoan-thoa-thuan">
                Điều khoản sử dụng
            </a>,
            <a href="https://trogiup.batdongsan.com.vn/docs/chinh-sach-bao-mat">
                Chính sách bảo mật
            </a>,
            <a href="https://trogiup.batdongsan.com.vn/docs/quy-che-hoat-dong">
                Quy chế
            </a>, 
            <a href="https://trogiup.batdongsan.com.vn/" class="sc-ksXhwv yKtqX">
                Chính sách
            </a> của chúng tôi.
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
</template>
<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.error {
    color: red;
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
    background: rgb(229, 57, 53);
    background: linear-gradient(90deg, rgba(229, 57, 53, 1) 0%, rgba(229, 57, 53, 1) 35%, rgba(44, 44, 44, 1) 100%);
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