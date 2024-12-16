<script setup>
import { ref } from 'vue'
import store from '@/store';
const isLoading = ref(false);
const email = ref('');
const code = ref('');
const showConfirmForm = ref(false);
const showNewPassword = ref(false);
const showreNewPassword = ref(false);
import useNotification from '@/composables/useNotification';
const notification = useNotification();
const newPassword = ref('');
const reNewPassword = ref('');
import { END_POINT } from '@/api/api';
import request from '@/utils/request';

const handleForgotPassword = async () => {
    isLoading.value = true;
    try {
        if (email.value) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await request.post(END_POINT.FORGET_PASSWORD, { email: email.value });
            if (response.success) {
                notification.success('Thành công vui lòng kiểm tra email!', response.message, {
                    showActions: false,
                });
                showConfirmForm.value = true;
            }
        }
    } catch (error) {
        if (error?.response?.data?.message === 'Not found account') {
            notification.error('Lỗi!', 'Email hiện chưa đăng ký tài khoản!', {
                showActions: false
            });
        } else {
            notification.error('Lỗi!', `Đăng nhập không thành công! Lỗi: ${error?.response?.data?.message || 'Không rõ lỗi'}`, {
                showActions: false
            });
        }
    } finally {
        isLoading.value = false;
    }
};
const emit = defineEmits(['switchToLogin']);

const handleConfirmPassword = async () => {
    isLoading.value = true;
    try {
        if (code.value && email.value && newPassword.value && reNewPassword.value) {
            if (newPassword.value != reNewPassword.value) {
                notification.error('Lỗi!', 'Xác nhận mật khẩu không giống nhau.', {
                    showActions: false,
                });
                return
            }
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
        <input type="email" v-model="email" placeholder="Nhập email" autocomplete="email"  required />
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
        <input type="email" hidden v-model="email" autocomplete="email"  placeholder="Nhập email" required />
        <div class="password-container">
            <input :type="showNewPassword ? 'text' : 'password'"  autocomplete="new-password"  v-model="newPassword" placeholder="Nhập mật khẩu mới" required />
            <span class="toggle-password" @click="showNewPassword = !showNewPassword" >
                <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                </svg>
            </span>
        </div>
        <div class="password-container">
            <input :type="showreNewPassword ? 'text' : 'password'" v-model="reNewPassword" placeholder="Xác nhận mật khẩu mới" required
                autocomplete="renew-password" />
            <span class="toggle-password" @click="showreNewPassword = !showreNewPassword" >
                <svg v-if="showreNewPassword" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
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
</style>