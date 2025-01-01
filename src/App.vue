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
import { encodeId, decodeId } from '@/utils/encoding';
import icon_logo from '@/assets/images/icon_logo1.png';
import logo from '@/assets/images/logo1.png';
import SupportIcons from "./components/SupportIcons.vue";
const license = ref({});

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
    const endpoints = [
      { name: "estateAnalysis", endpoint: END_POINT.ESTATEANALYSIS },
      { name: "financialAnalysis", endpoint: END_POINT.FINANCIALANALYSIS },
      { name: "teamTraining", endpoint: END_POINT.TEAMTRAINGING },
      { name: "newsSummary", endpoint: END_POINT.NEWSSUMMARY },
      { name: "investmentAdvice", endpoint: END_POINT.INVESTMENTADVISE }
    ];

    const results = await Promise.allSettled(
      endpoints.map(({ endpoint }) => request.get(endpoint))
    );

    const newAssistants = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value.assistant;
      } else {
        return null;
      }
    }).filter(assistant => assistant);

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

const isActive = (id) => {
  const currentId = route.params.id;
  return decodeId(currentId) === id;
};

const loadAssistant = async () => {
  await fetchAssistants();
};
const fetchLicense = async () => {
  try {
    const response = await request.get(END_POINT.LICENSE_GET);
    license.value = response.license;
    localStorage.setItem('license', JSON.stringify(response.license));
  } catch (error) {
    console.error('Lỗi lấy thông tin gói:', error);
  }
};

watch(isLogin, (newIsLogin) => {
  if (newIsLogin) {
    loadAssistant();
    fetchLicense();
  }
}, { deep: true });

watch(assistantsSelected, (newValue) => {
  localStorage.setItem("assistantsSelected", JSON.stringify(newValue));
}, { deep: true });

onMounted(() => {
  checkScreenSize();
  setNotificationComponent(notificationRef.value);
  if (isLogin.value) {
    checkMaintenanceStatus();
    loadAssistant();
    fetchLicense();
  }
  window.addEventListener('resize', checkScreenSize);
});

const goHome = () => {
  location.href = '/'
};
const isChatDetailPage = computed(() => route.path.includes('/chat'));
</script>
<template>
  <MaintenancePage v-if="isMaintenance" />
  <div v-else class="app-container">
    <div v-if="isLogin">
      <div class="navbar" :class="{ hidden: hiddenPopup }">
        <p>{{ license?.pack?.name }} với {{ license?.pack?.ask }} lời yêu cầu
        </p>
        <a href="/package" class="upgrade-button">
          <span class="icon crown"></span>
          Nâng cấp
        </a>
        <div class="user-text">
          <a href="/user_detail">
            &nbsp;&nbsp; <span>{{ user.name }}</span></a>
        </div>
      </div>
      <div class="body-bar" :class="{ hidden: hiddenPopup }">
        <div class="nav">
          <div class="logo">
            <div class="logo_web flex" @click="goHome">
              <div class="img flex">
                <img :src="icon_logo" alt="Logo" width="75">
              </div>
              <img :src="logo" alt="logo web" class="logo_text">
            </div>
          </div>

          <ul class="menu">
            <li class="menu_item" :class="{ active: currentRoute === '/assistant' || currentRoute.includes('/chat') }">
              <a href="/assistant" class="button"><i class="bx bx-equalizer"></i> <span>Hỏi đáp trợ lý</span></a>
            </li>
            <li class="menu_item" :class="{ active: currentRoute === '/contract' }">
              <a href="/contract" class="button"><i class="bx bx-file"></i> <span>Rà soát & tạo mới hợp đồng</span></a>
            </li>
            <li class="menu_item" :class="{ active: currentRoute === '/estate' }">
              <a href="/estate" class="button"><i class="bx bx-search-alt"></i> <span>Tìm kiếm & So sánh bất động
                  sản</span></a>
            </li>
            <li v-for="(assistant, index) in assistantsSelected" :key="index"
              :class="{ active: isActive(assistant.id) }" class="menu_item">
              <a class="button" @click.prevent="handleClick(assistant.id)">
                <i class="bx bx-message-square-detail"></i>
                <span>{{ assistant.name }}</span>
              </a>
            </li>
            <li class="menu_item" :class="{ active: currentRoute === '/check_process' }">
              <a href="/check_process" class="button"><i class='bx bx-check-shield'></i> <span>Hướng dẫn kiểm tra quy
                  hoạch.</span></a>
            </li>
            <li class="menu_item">
              <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai/" class="button" target="_blank">
                    <i style="margin-bottom: -3px;" class='bx bx-help-circle'></i>
                    &nbsp;&nbsp;<span> Hướng dẫn sử dụng </span>
                  </a>
            </li>
            <li class="menu_item" :class="{ active: currentRoute === '/package' }">
              <a href="/package" class="button"><i class='bx bx-package'></i><span>Gói dịch vụ</span></a>
            </li>
          </ul>
          <div class="user">
            <div class="user_profile flex">
              <div class="avatar flex">
                <img src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png"
                  alt="User Avatar" width="30">
              </div> &nbsp;&nbsp;
              <div class="username">
                <h3>{{ user.name }}</h3>
              </div>
              <div class="info">
                <!-- <div class="menu_item">
                  <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai/" class="button">
                    <i style="margin-bottom: -3px;" class='bx bx-help-circle'></i>
                    &nbsp;&nbsp;<span> Hướng dẫn sử dụng </span>
                  </a>
                </div> -->

                <div class="menu_item" :class="{ active: currentRoute === '/introducing_page' }">
                  <a href="https://an-phat-hung-ai.gitbook.io/an-phat-hung-ai/" class="button"><i style="margin-bottom: -3px;"
                      class='bx bxs-buildings'></i>
                    &nbsp;&nbsp;<span>Giới thiệu doanh nghiệp</span></a>
                </div>
                <div class="menu_item" :class="{ active: currentRoute === '/user_detail' }">
                  <a href="/user_detail" class="button"><i style="margin-bottom: -3px;" class='bx bxs-user-detail'></i>
                    &nbsp;&nbsp; <span>Thông tin cá nhân</span></a>
                </div>
                <div class="menu_item" @click="handleLogOut">
                  <div class="button">
                    <i class='bx bx-log-out'></i>&nbsp;&nbsp;
                    <span>Đăng xuất</span>
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
    </div>
    <div class="body-content" :class="[{ 'body-full': !isLogin }, { 'no-margin': hiddenPopup }]">
      <RouterView />
    </div>
    <NotificationModule ref="notificationRef" />
  </div>
  <div v-if="!isChatDetailPage">
    <SupportIcons />
  </div>
</template>
<style scoped>
.app-container {
  display: flex;
}

.body-bar {
  width: 310px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  position: fixed;
  transition: transform 0.3s ease;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  z-index: 999;
}

.navbar {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;
  height: auto;
  transition: margin-left .3s ease-in-out;
  border-bottom: 1px solid #dee2e6;
  background-color: #f5f5f5;
  z-index: 998;
  margin-left: 310px;
  left: 0;
  right: 0;
  gap: 15px;
  padding: 15px 15px 15px 45px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.navbar p {
  font-size: 12px;
  color: #333;
  margin: 0;
  text-align: right;
}

.upgrade-button {
  display: flex;
  align-items: center;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.upgrade-button .icon.crown {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  background-image: url('https://img.icons8.com/color/48/000000/crown.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.upgrade-button:hover {
  transform: scale(1.05);
}

.navbar .user-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.navbar .user-text:hover a {
  color: var(--color-primary);
}

.nav {
  padding: 0px 10px;
  height: 100vh;
  position: relative;
}

.navbar.hidden {
  margin-left: 0px;
}

.body-bar.hidden {
  transform: translateX(-310px);
}

.body-content {
  flex-grow: 1;
  overflow-y: auto;
  margin-left: 310px;
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
  gap: 7px;
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-bottom: 120px;
}

.menu::-webkit-scrollbar {
  display: none;
}

.menu_item {
  padding-left: 10px;
  display: flex;
  border: 1px solid rgba(170, 170, 170, 0);
  transition: all 0.5s;
  border-radius: 10px;
  /* background-color: var(--color-primary); */
  /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */
}

.menu_item.active {
  background-color: var(--color-primary);
}

.menu_item:hover {
  transform: translateX(15px);
  opacity: 0.8;
  cursor: pointer;
}

.menu_item:hover {
  color: var(--color-primary);
}

.menu_item:hover .button {
  color: var(--color-primary);
}

.menu_item.active .button {
  color: white;
}

.menu_item i {
  font-size: 1.1em;
}

.menu_item .button {
  display: flex;
  align-items: center;
  color: #111;
  width: 100%;
  padding: 15px 5px;
}



.menu_item .button span {
  padding-left: 15px;
  line-height: 18px;
}

.logo_web {
  display: flex;
  align-items: center;
  padding: 5px 0px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
}

.logo_web h2 {
  font-size: 25px;
  font-weight: bold;
  color: var(--color-primary);
}

.logo_web .logo_text {
  width: 175px;
  cursor: pointer;
}

.logo_web .img {
  display: flex;
  width: 100%;
  justify-content: center;
}

.user {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 310px;
  cursor: pointer;
  border-right: 1px solid #ddd;
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

.user_profile:hover {
  color: var(--color-primary);
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
  color: #111;
}

.info .menu_item:hover .button {
  color: var(--color-primary);
}

.info .menu_item.active .button {
  color: white;
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
  top: 0px;
  padding: 20px 10px;
}

.avatar {
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .body-bar.hidden {
    transform: translateX(-310px);
  }

  .body-content {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .upgrade-button {
    font-size: 12px;
    padding: 4px 8px;
  }
}

@media (max-width: 460px) {
  .upgrade-button {
    display: none;
  }

  .navbar {
    gap: 0px;
    margin-left: 0px;
  }

  .menu_icon.top {
    padding: 10px 10px;
  }
}
</style>
