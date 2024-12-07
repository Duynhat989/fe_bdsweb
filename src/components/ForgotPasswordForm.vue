<script setup>
import { ref } from 'vue'
import store from '@/store';
const isLoading = ref(false);
const email = ref('');
const showConfirmForm = ref(false);
import useNotification from '@/composables/useNotification';
const notification = useNotification();
const code = ref('');
const newPassword = ref('');
import { END_POINT } from '@/api/api';
import request from '@/utils/request';

const handleForgotPassword = async () => {
    isLoading.value = true;
    try {
        if (email.value) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await request.post(END_POINT.FORGET_PASSWORD, {email: email.value});
            if (response.success) {
                notification.success('Thành công vui lòng kiểm tra email!', response.message, {
                    showActions: false,
                });
                showConfirmForm.value = true; 
            }
        }
    } catch (error) {
        notification.error(
            'Lỗi!',
            `Gửi yêu cầu quên mật khẩu không thành công! Lỗi: ${error?.response?.data?.message || 'Không rõ lỗi'}`,
            {
                showActions: false,
            }
        );

    } finally {
        isLoading.value = false;
    }
};
const emit = defineEmits(['switchToLogin']);

const handleConfirmPassword = async () => {
    isLoading.value = true;
    try {
        if (code.value && email.value && newPassword.value) {
            await store.dispatch('confirmPassword', {
                code: code.value,
                email: email.value,
                new_password: newPassword.value,
            });
            notification.success('Thành công!', 'Mật khẩu của bạn đã được thay đổi.', {
                showActions: false,
            });
            emit('switchToLogin');
        } else {
            notification.error('Lỗi!', 'Vui lòng điền đầy đủ thông tin.', {
                showActions: false,
            });
        }
    } catch (error) {
        notification.error('Lỗi!', `Xác nhận mật khẩu không thành công! Lỗi: ${error}`, {
            showActions: false,
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
<template>
    <h3 v-if="!showConfirmForm">Quên mật khẩu</h3>
    <h3 v-else>Xác nhận mật khẩu mới</h3>
    <form v-if="!showConfirmForm" class="form" @submit.prevent="handleForgotPassword">
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
                Đang gửi yêu cầu ...
            </span>
            <span v-else>Gửi yêu cầu</span>
        </button>
    </form>

    <form v-else class="form" @submit.prevent="handleConfirmPassword">
        <input type="text" v-model="code" placeholder="Nhập mã xác nhận" required />
        <input type="email" v-model="email" placeholder="Nhập email" required />
        <input type="password" v-model="newPassword" placeholder="Nhập mật khẩu mới" required  autocomplete="current-password"/>
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
                Đang xác nhận ...
            </span>
            <span v-else>Xác nhận mật khẩu</span>
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
</style>