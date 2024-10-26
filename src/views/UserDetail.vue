<script setup>
import { ref } from 'vue';

const userInfo = ref({
    name: 'Nguyen Van A',
    role: 'Admin',
    package: 'Premium',
    phone: '0123456789',
    email: 'user@example.com',
});

const isEditing = ref(false);

const toggleEdit = () => {
    isEditing.value = !isEditing.value;
};

const updateUser = () => {
    console.log('User updated:', userInfo.value);
    toggleEdit();
};
</script>

<template>
    <div class="main-container">
        <div class="user-page">
            <h1 class="title">Thông tin người dùng</h1>

            <div class="user-info">
                <p><strong>Name:</strong> {{ userInfo.name }}</p>
                <p><strong>Role:</strong> {{ userInfo.role }}</p>
                <p><strong>Gói:</strong> {{ userInfo.package }}</p>
                <p><strong>Phone:</strong> {{ userInfo.phone }}</p>
                <p><strong>Email:</strong> {{ userInfo.email }}</p>
            </div>
            <div v-if="isEditing" class="edit-form">
                <div class="form-box">
                    <h3>Cập nhật thông tin tài khoản</h3>
                    <label>
                        Name:
                        <input v-model="userInfo.name" type="text" />
                    </label>
                    <label>
                        Phone:
                        <input v-model="userInfo.phone" type="text" />
                    </label>
                    <label>
                        Email:
                        <input v-model="userInfo.email" type="email" />
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
    padding: 4px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
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
}
</style>
