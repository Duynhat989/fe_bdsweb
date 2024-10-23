<script setup>
import { ref } from 'vue';
import ItemBox from '@/components/ItemBox.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import LoginForm from '@/components/LoginForm.vue';
import footerView from '@/components/footerView.vue';
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue';

const activeTab = ref('login');
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>
<template>
  <div class="main">
    <div class="header-title">
      <h1 class="title">Bất động sản Hưng Thịnh</h1>
      <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
    </div>
    <div class="main-container">
      <div class="left-box">
        <ItemBox url="./" text="Hỏi đáp trợ lý" imageUrl="/q_a.png" />
        <ItemBox url="" text="Xử lý & tạo mới hồ sơ" imageUrl="/contract.png" />
        <ItemBox url="" text="Tìm kiếm bất động sản" imageUrl="/search_home.png" />
        <ItemBox url="" text="Khóa học bất động sản" imageUrl="/course.png" />
      </div>

      <div class="right-box">
        <div class="right-icon">
          <img src="/icon_logo1.png" alt="icon logo">
        </div>
        <div class="tabs">
          <button class="tab-button" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">Đăng nhập
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">Đăng
            ký
          </button>
        </div>

        <div class="form-container">
          <LoginForm v-if="activeTab === 'login'" @switchToForgotPassword="setActiveTab('forgotPassword')" />
          <RegisterForm v-if="activeTab === 'register'" @switchToForgotPassword="setActiveTab('forgotPassword')" />
          <ForgotPasswordForm v-if="activeTab === 'forgotPassword'"/>
        </div>
      </div>
    </div>
    <footerView/>
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
  margin: 100px auto;
  gap: 30px;
}

.header-title {
  text-align: center;
}

.header-title .title {
  color: #e53935;
}

.left-box {
  width: 55%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.right-box {
  width: calc(100% - 55% - 20px);
  background-color: white;
  padding: 60px 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.right-icon {
  position: absolute;
  right: -10px;
  top: -75px;
}

.right-icon img {
  width: 100px;
  height: auto;
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
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f4f4f4;
  color: #333;
  border: none;
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

/* Responsive Styles */
@media (max-width: 1200px) {
  .main-container {
    max-width: 1000px;
    padding: 15px;
  }


}

@media (max-width: 992px) {
  .main-container {
    max-width: 800px;
  }

}

@media (max-width: 768px) {
  .main-container {
    max-width: 600px;
  }

}

@media (max-width: 576px) {
  .main-container {
    max-width: 100%;
    padding: 10px;
  }

}
</style>
