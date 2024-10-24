<script setup>
import { ref, watch } from 'vue';
import ItemBox from '@/components/ItemBox.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import LoginForm from '@/components/LoginForm.vue';
import footerView from '@/components/footerView.vue';
import ForgotPasswordForm from '@/components/ForgotPasswordForm.vue';
import store from '@/store';

const isHighlighted = ref(false);
const activeTab = ref('login');

// watch(activeTab, (newTab) => {
//   if (newTab === 'login') {
//     isHighlighted.value = true;
//   }
// });
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
      <h1 class="title">Hưng Thịnh</h1>
      <p>Hỗ trợ bạn trong việc tìm kiếm thông tin và giải đáp thắc mắc về bất động sản.</p>
      <p>Trợ lý Hưng Thịnh giúp tra cứu, tìm kiếm và giải đáp mọi thắc mắc về bất động sản, giúp việc mua bán và quản lý
        trở nên dễ dàng hơn.</p>
    </div>
    <div class="content">
      <div class="left-box">
        <ItemBox @click="handleClick('assistant')" text="Hỏi đáp trợ lý" imageUrl="/q_a.png" />
        <ItemBox @click="handleClick('contract')" text="Rà soát & tạo mới hợp đồng" imageUrl="/contract.png" />
        <ItemBox @click="handleClick('search')" text="Tìm kiếm bất động sản" imageUrl="/search_home.png" />
        <ItemBox @click="handleClick('course')" text="Khóa học bất động sản" imageUrl="/course.png" />
      </div>

      <div class="right-box" :class="{ highlight: isHighlighted }">
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
          <ForgotPasswordForm v-if="activeTab === 'forgotPassword'" />
        </div>
      </div>
    </div>
  </div>
  <footerView />
</template>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 10px auto;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  margin: 100px 0;
}

.header-title {
  text-align: center;
  margin: 30px auto;
}

.header-title .title {
  font-size: 50px;
  font-weight: bold;
  color: #e03d31;
  line-height: 56px;
}

.header-title p {
  font-size: 18px;
  color: #555;
  margin-top: 10px;
  line-height: 1.6;
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
    padding: 0px 15px ;
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

  .left-box {
    order: 2;
    gap: 10px;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .main-container {
    max-width: 100%;
  }
}
</style>
