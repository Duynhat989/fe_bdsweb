<script setup>
import { ref } from 'vue';
import ItemBox from '@/components/ItemBox.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import LoginForm from '@/components/LoginForm.vue';
const activeTab = ref('login');
</script>
<template>
  <div class="main">
    <div class="header-title">
      <h1 class="title">Bất động sản Hưng Thịnh</h1>
      <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
    </div>
    <div class="main-container">
      <div class="left-box">
        <ItemBox icon="🎤" text="Hỏi đáp trợ lý" />
        <ItemBox icon="📄" text="Xử lý & tạo mới hồ sơ" />
        <ItemBox icon="🔍" text="Tìm kiếm bất động sản" />
        <ItemBox icon="🎥" text="Khóa học bất động sản" />
      </div>

      <div class="right-box">
        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">Đăng nhập
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">Đăng
            ký
          </button>
        </div>

        <div class="form-container">
          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-if="activeTab === 'register'" />
        </div>
      </div>
    </div>

  </div>
</template>



<style scoped>
.main {
  margin: 40px 0;
}

.main-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1300px;
  margin: 30px auto;
  gap: 30px;
}

.header-title {
  text-align: center;
}

.header-title .title {
  color: #e53935;
}

.left-box {
  flex: 2.5;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.right-box {
  flex: 1;
  background-color: white;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  justify-content: left;
  margin-bottom: 20px;
  width: fit-content;
  border-radius: 5px;
  overflow: hidden;
}

.tab-button {
  padding: 5px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f4f4f4;
  color: #333;
  border: none;
  /* margin: 0 10px; */
}

.tab-button.active {
  background: rgb(229, 57, 53);
  background: linear-gradient(90deg, rgba(229, 57, 53, 1) 0%, rgba(229, 57, 53, 1) 35%, rgba(44, 44, 44, 1) 100%);
  color: white;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}
</style>
