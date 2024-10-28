<script setup>
import { ref } from 'vue'
import store from '@/store';
const isLoading = ref(false);
const email = ref('');

const handleForgotPassword = async (event) => {
    isLoading.value = true;
    try {
        if (email.value) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await store.dispatch('forgePassword', { email: email.value });
            notification.success('Thành công!', 'Gửi mail thành công vui lòng check mail của bạn!', {
                showActions: false
            })
        }
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
    <h3>Quên mật khẩu</h3>
    <form class="form" @submit.prevent="handleForgotPassword">
        <input type="email" v-model="email" placeholder="Nhập email" required />
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
                Đang gửi yêu cầu ...</span>
            <span v-else>Gửi yêu cầu</span>
        </button>
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