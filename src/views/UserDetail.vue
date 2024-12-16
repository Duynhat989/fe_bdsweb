<script setup>
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { ref, onMounted } from 'vue';
import store from '@/store';
import useNotification from '@/composables/useNotification';
const notification = useNotification();

const userInfo = ref({});
const license = ref({});
const isLoading = ref(false);

const form = ref({
    name: userInfo.value.name || '',
    phone: userInfo.value.phone || '',
    email: userInfo.value.email || ''
});
const fetchLicense = async () => {
    try {
        const response = await request.get(END_POINT.LICENSE_GET);
        license.value = response.license;
    } catch (error) {
        console.error('Lỗi lấy thông tin gói:', error);
    }
};

const fetchUser = async () => {
    try {
        const response = await request.get(END_POINT.USER_GET);
        userInfo.value = response.data;
        form.value = {
            name: userInfo.value.name || '',
            phone: userInfo.value.phone || '',
            email: userInfo.value.email || ''
        };
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
    }
};

const updateUser = async () => {
    isLoading.value = true;
    try {
        const updatedUserData = {
            email: form.value.email,
            name: form.value.name,
            phone: form.value.phone
        };
        const response = await request.post(END_POINT.USER_UPDATE, updatedUserData);

        if (response.success === true) {
            notification.success('Thành công!', 'Thông tin đã được cập nhật thành công!', {
                showActions: false
            })
            userInfo.value = response.data;
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.name = response.data.name;
            store.commit('setUser', storedUser);
        } else {
            notification.error('Lỗi!', `Cập nhật thất bại, vui lòng thử lại sau!}`, {
                showActions: false
            })
        }
    } catch (error) {
        notification.error('Lỗi!', `Cập nhật thất bại, vui lòng thử lại sau!}`, {
            showActions: false
        })
    } finally {
        isLoading.value = false;
    }
};
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const showPasswordBox = ref(false);

const togglePasswordBox = () => {
    showPasswordBox.value = !showPasswordBox.value;
};
const updatePassword = () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        notification.error('Lỗi!', `Mật khẩu xác nhận không khớp!}`, {
            showActions: false
        })
        return;
    }
    // call api 

};
const loadUser = async () => {
    await fetchLicense();
    await fetchUser();
};

onMounted(() => {
    loadUser();
});
</script>

<template>
    <div class="main-container">
        <div class="user-page">
            <h1 class="title">Thông tin người dùng</h1>
            <div class="user-info">
                <p><strong>Tên người dùng:</strong> {{ userInfo?.name }}</p>
                <p><strong>Phone:</strong> {{ userInfo?.phone }}</p>
                <p><strong>Email:</strong> {{ userInfo?.email }}</p>
                <p><strong>Quyền:</strong> {{ userInfo?.role === 3 ? 'Người dùng' : userInfo?.role === 1 ? 'Admin' :
                    'Vai trò không xác định' }}</p>
                <p><strong>Gói đang sử dụng:</strong> {{ license?.pack?.name }} với {{ license?.pack?.ask }} lời yêu cầu
                </p>
            </div>
            <div  class="edit-form">
                <div class="form-box">
                    <h3>Cập nhật thông tin tài khoản</h3>
                    <label>
                        Name:
                        <input v-model="form.name" type="text" />
                    </label>
                    <label>
                        Phone:
                        <input v-model="form.phone" type="text" />
                    </label>
                    <label>
                        Email:
                        <input v-model="form.email" type="email" />
                    </label>
                </div>
                <button @click="updateUser" class="save-btn">Lưu thay đổi</button>
            </div>
            <button @click="togglePasswordBox" class="toggle-btn">
              Đổi mật khẩu
            </button>
        </div>
    </div>
    
    <div v-if="showPasswordBox" class="modal">
        <div class="modal-content edit-form">
            <span class="close-btn" @click="togglePasswordBox">&times;</span>
            <h3>Đổi mật khẩu</h3>
            <label>
                Mật khẩu cũ:
                <input v-model="passwordForm.oldPassword" type="text" placeholder="Nhập mật khẩu cũ" />
            </label>
            <label>
                Mật khẩu mới:
                <input v-model="passwordForm.newPassword" type="text" placeholder="Nhập mật khẩu mới" />
            </label>
            <label>
                Xác nhận mật khẩu mới:
                <input v-model="passwordForm.confirmPassword" type="text" placeholder="Nhập lại mật khẩu mới" />
            </label>
            <button @click="updatePassword" class="save-btn">Lưu mật khẩu</button>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    justify-content: center;
    padding: 0 5%;
    margin: 20px 0;

}

.user-page {
    width: 100%;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    color: #333;
}

.title {
    color: var(--color-primary);
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
}

.user-info p {
    font-size: 16px;
    margin: 5px 0;
}

.user-info strong {
    color: #242424;
    font-weight: bold;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    color: #555;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 16px;
    background-color: #f44336;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background-color: #d32f2f;
}
.toggle-btn {
    margin-top: 20px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 5px 16px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
}

.toggle-btn:hover {
    opacity: 0.8;
}
.edit-btn,
.save-btn {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 5px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
    font-family: inherit;
}

.edit-btn:hover,
.save-btn:hover {
    opacity: 0.8;
}

.form-box {
    margin-top: 15px;
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    padding: 20px;
}

.edit-form {
    margin-top: 15px;
}

.edit-form label {
    display: block;
    margin: 10px 0;
    font-size: 14px;
    color: #333;
    text-align: left;
}

.edit-form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
    font-family: inherit;
}
</style>
