<script setup>
import { ref, computed, onMounted, watch } from "vue";
import store from '@/store';
import { useRouter, RouterView } from 'vue-router';
import { Notifications } from "@kyvg/vue3-notification";

const isLogin = computed(() => store.getters.isLogin);
const user = computed(() => store.getters.getUser);
const hiddenPopup = ref(false);

const router = useRouter();
const checkScreenSize = () => {
  hiddenPopup.value = window.innerWidth < 1024
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
const handleLogOut = async () => {
  try {
    await store.dispatch('logout');
    router.push('/');
  } catch (error) {
    console.error('Logout failed');
  }
};
</script>
<template>
  <div class="app-container">
    <div class="body-bar" :class="{ hidden: hiddenPopup }" v-if="isLogin">
      <div class="nav">
        <div class="logo">
          <div class="logo_web flex">
            <div class="img flex">
              <img src="../src/assets/images/icon_logo.png" alt="Logo" width="50">
            </div> &nbsp;&nbsp;
            <h2>Hưng thịnh</h2>
          </div>
        </div>
        <ul class="menu">
          <li class="menu_item">
            <a href="/assistant" class="button"><i class="bx bx-equalizer"></i> <span>Hỏi đáp trợ lý</span></a>
          </li>
          <li class="menu_item">
            <a href="/contract" class="button"><i class="bx bx-file"></i> <span>Rà soát & tạo mới hợp đồng</span></a>
          </li>
          <li class="menu_item">
            <a href="/search" class="button"><i class="bx bx-search-alt"></i> <span>Tìm kiếm bất động sản</span></a>
          </li>
          <li class="menu_item">
            <a href="/course" class="button"><i class="bx bx-movie-play"></i> <span>Khóa học bất động sản</span></a>
          </li>
          <li class="menu_item">
            <a href="/introducing_page" class="button"><i class='bx bxs-buildings'></i> <span>Giới thiệu doanh nghiệp</span></a>
          </li>
          <li class="menu_item">
            <a href="/package" class="button"><i class='bx bx-package' ></i><span>Bản quyền</span></a>
          </li>
          <li class="menu_item">
            <a href="/user_detail" class="button"><i class='bx bxs-user-detail' ></i><span>Thông tin cá nhân</span></a>
          </li>
        </ul>
        <div class="user">
          <div class="user_profile flex">
            <div class="avatar flex">
              <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="User Avatar" width="30">
            </div> &nbsp;&nbsp;
            <div class="username">
              <h3>{{ user.name }}</h3>
            </div>
            <div class="logout" @click="handleLogOut">
              <span>Đăng xuất</span>
            </div>
          </div>
        </div>
      </div>
      <div class="menu_icon top" v-if="hiddenPopup" @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em; color: #e03d31;" class='bx bx-menu-alt-left'></i>
      </div>
      <div class="menu_icon" v-else @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em; color: #e03d31;" class='bx bx-horizontal-left'></i>
      </div>
    </div>
    <div class="body-content" :class="[{ 'body-full': !isLogin }, { 'no-margin': hiddenPopup }]">
      <RouterView />
    </div>
    <notifications />
  </div>
</template>
<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.body-bar {
  width: 300px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  position: fixed;
  height: 100vh;
  transition: transform 0.3s ease;
  z-index: 999;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.nav {
  padding: 0px 10px;
}

.hidden {
  transform: translateX(-300px);
}

.body-content {
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
  margin-left: 300px;
  transition: margin-left 0.3s ease;
}

.body-content.body-full,
.body-content.no-margin {
  margin-left: 0;
}

.menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu_item {
  padding-left: 10px;
  display: flex;
  border: 1px solid rgba(170, 170, 170, 0);
  transition: all 0.5s;
  border-radius: 10px;
  color: #fff;
  background-color: #e03d31;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}


.menu_item:hover {
  background-color: #f4d1ce;
  cursor: pointer;
}

.menu_item:hover .button {
  color: black;
}

.menu_item i {
  font-size: 1.5em;
}

li .button {
  display: flex;
  align-items: center;
  color: #ececec;
  width: 100%;
  padding: 15px 5px;
}



li .button span {
  padding-left: 5px;
}

.logo_web {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
}

.user {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
}

.user:hover {
  border-color: #fff;
  color: #111;
}

.user_profile {
  border-top: 1px solid #ccc;
  padding: 10px 20px;
  align-items: center;
  position: relative;
  display: flex;
  background-color: #f5f5f5;
}

.user:hover .logout {
  left: 0px;
  bottom: 100%;
  transition: all 0.5s;

}

.logout {
  position: absolute;
  bottom: 110%;
  cursor: pointer;
  padding: 10px;
  background-color: #ececec;
  width: 100%;
  border-radius: 5px;
  left: -100%;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.logout:hover {
  background-color: #e03d31;
  color: #ececec;
}

.menu_icon {
  position: absolute;
  right: 5px;
  cursor: pointer;
  z-index: 11;
  top: 36px;
}

.menu_icon.top {
  right: -15%;
  top: 20px;
}

.avatar {
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .body-bar.hidden {
    transform: translateX(-300px);
  }

  .body-content {
    margin-left: 0;
  }
}
</style>
