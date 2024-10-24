<script setup>
import { ref } from 'vue'
import store from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();

const email = ref('');
const errorMessage = ref('');


const handleForgotPassword = async (event) => {
    if (email.value) {
        console.log('Sending forgot password request for:', email.value);
    }
}

</script>
<template>
    <h3>Quên mật khẩu</h3>
    <form class="form" @submit.prevent="handleForgotPassword">
        <input type="email" v-model="email" placeholder="Nhập email" required />
        <button type="submit">Gửi yêu cầu</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 25px;
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