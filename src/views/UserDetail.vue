<script setup>
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { notify } from '@kyvg/vue3-notification';
import { ref, onMounted } from 'vue';
import store from '@/store';

const userInfo = ref({});
const license = ref({});
const isLoading = ref(false);
const isEditing = ref(false);

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
        // console.error('Lỗi lấy thông tin gói:', error);
    }
};

const fetchUser = async () => {
    try {
        const response = await request.get(END_POINT.USER_GET);
        userInfo.value = response.data;
    } catch (error) {
        // console.error('Lỗi lấy thông tin người dùng:', error);
    }
};


const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
        form.value = {
            name: userInfo.value.name || '',
            phone: userInfo.value.phone || '',
            email: userInfo.value.email || ''
        };
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
            notify({
                title: 'Thành công',
                text: 'Thông tin đã được cập nhật thành công!',
                type: 'success'
            });
            userInfo.value = response.data;
            const storedUser = JSON.parse(localStorage.getItem('user')); 
            storedUser.name = response.data.name;
            store.commit('setUser', storedUser);
        } else {
            throw new Error('Cập nhật thất bại, vui lòng thử lại.');
        }
    } catch (error) {
        notify({
            title: 'Lỗi',
            text: error.response?.data?.message || 'Cập nhật thất bại, vui lòng thử lại sau.',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
        toggleEdit();
    }
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
            <div v-if="isEditing" class="edit-form">
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
            <button @click="toggleEdit" class="edit-btn">{{ isEditing ? 'Ẩn' : 'Chỉnh sửa' }}</button>
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
    color: #ff3f3f;
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

.edit-btn,
.save-btn {
    background-color: #ff3f3f;
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
    background-color: #e63939;
}

.form-box {
    margin-top: 15px;
    border: 1px solid #e63939;
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
