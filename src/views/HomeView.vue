<script setup>
import { ref, watch } from 'vue';
import ItemBox from '@/components/ItemBox.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import LoginForm from '@/components/LoginForm.vue';
import footerView from '@/components/footerView.vue';
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue';
import store from '@/store';

import q_a from '@/assets/images/q_a.png';
import course from '@/assets/images/course.png';
import search_home from '@/assets/images/search_home.png';
import contract from '@/assets/images/contract.png';
import icon_logo1 from '@/assets/images/icon_logo1.png';

const isHighlighted = ref(false);
const activeTab = ref('login');

const setActiveTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'login') {
    isHighlighted.value = true;
    setTimeout(() => {
      isHighlighted.value = false;
    }, 3000);
  }
};
const handleClick = (routeName) => {
  if (!store.getters.isLogin) {
    localStorage.setItem('intendedRoute', routeName);
    setActiveTab('login');
  } else {
    router.push({ name: routeName });
  }
};
</script>
<template>
  <div class="main-container">
    <div class="header-title">
      <h1 class="title">An Phát Hưng</h1>
      <p >Trợ Lý Toàn Năng Bất Động Sản</p>
    </div>
    <div class="content">
      <!-- <div class="left-box">
        <ItemBox @click="handleClick('assistant')" text="Hỏi đáp trợ lý" :imageUrl="q_a" />
        <ItemBox @click="handleClick('contract')" text="Rà soát & tạo mới hợp đồng" :imageUrl="contract" />
        <ItemBox @click="handleClick('estate')" text="Tìm kiếm bất động sản" :imageUrl="search_home" />
        <ItemBox @click="handleClick('package')" text="Gói dịch vụ" :imageUrl="course" />
      </div> -->
      <div class="right-box" :class="{ highlight: isHighlighted }">
        <div class="right-icon">
          <img :src="icon_logo1" alt="icon logo">
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
          <ForgotPasswordForm  v-if="activeTab === 'forgotPassword'"  @switchToLogin="setActiveTab('login')"/>
        </div>
      </div>
    </div>
  </div>
  <footerView />
</template>
<style scoped>
.main-container {
  max-width: 1200px;
  padding: 0px 5%;
  margin: 80px auto;
  height: 100vh;
}

.header-title {
  text-align: center;
  margin: 20px auto;
}

.header-title .title {
  font-size: 50px;
  color: var(--color-primary);
  line-height: 56px;
  font-weight: bold !important;
  border-radius: 10px;
  margin-bottom: 10px;
}

.header-title p {
  font-size: 18px;
  color: #f4f4f4;
  margin-top: 10px;
  line-height: 1.6;
  font-weight: 500!important;
}

/* .left-box {
  width: 55%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
} */

.right-box {
  width: 100%;
  max-width: 550px;
  background-color: #ffffffba;
  padding: 45px 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0 auto;
}

.right-icon {
  position: absolute;
  left: -10px;
  top: -60px;
}

.right-icon img {
  width: 150px;
  height: auto;
}

.tabs {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  /* width: fit-content; */ 
  border-radius: 5px;
  overflow: hidden;
}

.tab-button {
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f4f4f4;
  color: #333;
  border: none;
  min-width: 180px;
}
.tab-button:first-child {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.tab-button:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}
.tab-button.active {
  background: var(--color-primary);
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) 35%, rgba(44, 44, 44, 1) 100%);
  color: white;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

.highlight {
  border: 2px solid #ff5722;
  background-color: #fff3e0;
  box-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
  transition: all 0.3s ease;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .main-container {
    max-width: 1000px;
    padding: 0px 15px;
  }


}

@media (max-width: 992px) {
  .main-container {
    max-width: 800px;
  }

  .right-icon {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .main-container {
    max-width: 600px;
  }

  .header-title .title {
    font-size: 30px;
    line-height: 40px;
  }

  .header-title p {
    font-size: 16px;
  }

  .content {
    flex-direction: column;
  }

  .left-box,
  .right-box {
    width: 100%;
  }

  .right-box {
    order: 1;
  }

  .right-icon {
    right: -12px;
    top: -105px;
  }

  .right-icon img {
    width: 120px;
    height: auto;
  }

  .left-box {
    order: 2;
    gap: 10px;
    justify-content: center;
  }
  .tab-button {
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .main-container {
    max-width: 100%;
    height: auto;
  }
  .right-icon {
    right: -15px;
    top: -35px;
  }
}
</style>
