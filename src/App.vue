<script setup>
import { ref, computed, onMounted, watch } from "vue";
import store from '@/store';
import { useRouter, RouterView, useRoute } from 'vue-router';
import NotificationModule from "./components/module/NotificationModule.vue";
import useNotification from "./composables/useNotification";
import MaintenancePage from "./views/MaintenancePage.vue";
import { checkMaintenanceStatus, isMaintenance } from "./utils/maintenanceCheck";
import request from "./utils/request";
import { END_POINT } from "./api/api";
import { encodeId } from '@/utils/encoding';
import icon_logo from '@/assets/images/icon_logo.png';
const notificationRef = ref(null)
const hiddenPopup = ref(false);
const router = useRouter();
const route = useRoute();
const { setNotificationComponent } = useNotification()
const isLogin = computed(() => store.getters.isLogin);
const user = computed(() => store.getters.getUser);
const currentRoute = computed(() => route.path);
const assistantsSelected = ref(JSON.parse(localStorage.getItem("assistantsSelected")) || []);
const checkScreenSize = () => {
  hiddenPopup.value = window.innerWidth < 1024
};
const isDataChanged = (newData, oldData) => {
  return JSON.stringify(newData) !== JSON.stringify(oldData);
};
const fetchAssistants = async () => {
  try {
    const [estateAnalysis, financialAnalysis, teamTraining, newsSummary] = await Promise.all([
      request.get(END_POINT.ESTATEANALYSIS),
      request.get(END_POINT.FINANCIALANALYSIS),
      request.get(END_POINT.TEAMTRAINGING),
      request.get(END_POINT.NEWSSUMMARY)
    ]);

    const newAssistants = [
      estateAnalysis.assistant,
      financialAnalysis.assistant,
      teamTraining.assistant,
      newsSummary.assistant
    ];
    const storedAssistants = JSON.parse(localStorage.getItem("assistantsSelected"));
    if (isDataChanged(newAssistants, storedAssistants)) {
        assistantsSelected.value = newAssistants;
        localStorage.setItem("assistantsSelected", JSON.stringify(newAssistants));
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error('Lỗi 500: Lỗi máy chủ trong quá trình lấy danh sách trợ lý:', error);
    } else {
      console.error('Lỗi lấy danh sách trợ lý:', error);
    }
  }
};

const handleLogOut = async () => {
  try {
    await store.dispatch('logout');
    localStorage.removeItem("assistantsSelected"); 
    router.push('/');
  } catch (error) {
    console.error('Logout failed');
  }
};
const handleClick = (id) => {
  const encodedId = encodeId(id);
  window.location.href = `/assistant/${encodedId}`;
};

watch(isLogin.value, () => {
  if (isLogin.value) {
      fetchAssistants();
  }
}, { deep: true });

watch(assistantsSelected, (newValue) => {
    localStorage.setItem("assistantsSelected", JSON.stringify(newValue));
}, { deep: true });

onMounted(() => {
  checkMaintenanceStatus();
  checkScreenSize();
  setNotificationComponent(notificationRef.value);
  if (isLogin.value) { 
    fetchAssistants();
  }
  window.addEventListener('resize', checkScreenSize);
});
</script>
<template>
  <MaintenancePage v-if="isMaintenance"/>
  <div v-else class="app-container">
    <div class="body-bar" :class="{ hidden: hiddenPopup }" v-if="isLogin">
      <div class="nav">
        <div class="logo">
          <div class="logo_web flex">
            <div class="img flex">
              <img :src="icon_logo" alt="Logo" width="50">
            </div> &nbsp;&nbsp;&nbsp;&nbsp;
            <h2>An Phát <br> Hưng . AI</h2>
          </div>
        </div>
        <ul class="menu">
          <li class="menu_item" :class="{ active: currentRoute === '/assistant' }">
            <a href="/assistant" class="button"><i class="bx bx-equalizer"></i> <span>Hỏi đáp trợ lý</span></a>
          </li>
          <li class="menu_item" :class="{ active: currentRoute === '/contract' }">
            <a href="/contract" class="button"><i class="bx bx-file"></i> <span>Rà soát & tạo mới hợp đồng</span></a>
          </li>
          <li class="menu_item" :class="{ active: currentRoute === '/estate' }">
            <a href="/estate" class="button"><i class="bx bx-search-alt"></i> <span>Tìm kiếm & So sánh bất động
                sản</span></a>
          </li>
          <li v-for="(assistant ,index) in assistantsSelected" :key="index" class="menu_item">
            <a class="button" @click.prevent="handleClick(assistant.id)">
              <i class="bx bx-message-square-detail"></i>
              <span>{{ assistant.name }}</span>
            </a>
          </li>
          <li class="menu_item" :class="{ active: currentRoute === '/course' }">
            <a href="/course" class="button"><i class="bx bx-movie-play"></i> <span>Khóa học bất động sản</span></a>
          </li>

          <li class="menu_item" :class="{ active: currentRoute === '/package' }">
            <a href="/package" class="button"><i class='bx bx-package'></i><span>Gói dịch vụ</span></a>
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
            <div class="info">
              <div class="menu_item" :class="{ active: currentRoute === '/introducing_page' }">
                <a href="/introducing_page" class="button"><i style="margin-bottom: -3px;" class='bx bxs-buildings'></i>
                  &nbsp;&nbsp;<span>Giới thiệu doanh nghiệp</span></a>
              </div>
              <div class="menu_item" :class="{ active: currentRoute === '/user_detail' }">
                <a href="/user_detail" class="button"><i style="margin-bottom: -3px;" class='bx bxs-user-detail'></i>
                  &nbsp;&nbsp; <span>Thông tin cá nhân</span></a>
              </div>
              <div class="menu_item" @click="handleLogOut">
                <div class="button">
                  <i class='bx bx-log-out'></i>&nbsp;&nbsp;
                  <span >Đăng xuất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu_icon top" v-if="hiddenPopup" @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em; color: var(--color-primary);" class='bx bx-menu-alt-left'></i>
      </div>
      <div class="menu_icon" v-else @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em; color: var(--color-primary);" class='bx bx-horizontal-left'></i>
      </div>
    </div>
    <div class="body-content" :class="[{ 'body-full': !isLogin }, { 'no-margin': hiddenPopup }]">
      <RouterView />
    </div>
    <NotificationModule ref="notificationRef"/>
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
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 10px;
}

.menu::-webkit-scrollbar {
  display: none;
}

.menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.menu_item {
  padding-left: 10px;
  display: flex;
  border: 1px solid rgba(170, 170, 170, 0);
  transition: all 0.5s;
  border-radius: 10px;
  color: #fff;
  background-color: var(--color-primary);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.menu_item.active,
.menu_item:hover {
  opacity: 0.8;
  cursor: pointer;
  background-color: #cef4f2;
}

.menu_item.active .button,
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
  line-height: 18px;
}

.logo_web {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
}

.logo_web h2 {
  font-size: 25px;
  font-weight: bold;
  color: var(--color-primary);
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

.user:hover .info {
  left: 0px;
  bottom: 100%;
  transition: all 0.5s;

}

.info {
  position: absolute;
  bottom: 110%;
  cursor: pointer;
  padding: 10px;
  background-color: #ececec;
  width: 100%;
  border-radius: 5px;
  left: -100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}


.info .menu_item .button {
  padding: 6px;
  display: flex;
  align-items: center;
}

.user_profile:hover .menu_item .button {
  color: #ffff;

}

.info .menu_item.active .button {
  color: #111;
}

.info .menu_item:hover .button {
  color: #111;
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
