<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from 'vue-router'


const hiddenPopup = ref(false)
</script>

<template>
  <div :class="hiddenPopup ? 'body flex hidden':'body flex'">
    <div class="body-bar">
      <div class="nav">
        <div class="logo">
          <div class="logo_web flex" style="justify-items: center;">
            <div class="img flex" style="align-items: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/5339/5339181.png" alt="" width="50">
            </div>
            <h2>Hưng thịnh</h2>
          </div>
        </div>
        <ul class="menu">
          <li class="menu_item">
            <a href="" class="button"><i class='bx bx-equalizer'></i> <span>Hỏi đáp trợ lý</span></a>
          </li>
          <li class="menu_item">
            <a href="" class="button"><i class='bx bx-file'></i> <span>Xử lý & tạo mới hồ sơ</span></a>
          </li>
          <li class="menu_item">
            <a href="" class="button"><i class='bx bx-search-alt'></i> <span>Tìm kiếm bất động sản</span></a>
          </li>
          <li class="menu_item">
            <a href="" class="button"><i class='bx bx-movie-play'></i> <span>Khóa học bất động sản</span></a>
          </li>
        </ul>
        <div class="user">
          <div class="user_profile flex">
            <div class="avata flex" style="align-items: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="" width="30" height="30">
            </div>
            <div class="username" style="padding-left: 10px;">
              <h3>Dinh Viet Duy</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="menu_icon" v-if="hiddenPopup" @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em;" class='bx bx-menu-alt-left' ></i>
      </div>
      <div class="menu_icon center" v-else  @click="hiddenPopup = !hiddenPopup">
        <i style="font-size: 2em;" class='bx bx-caret-left-circle' ></i>
      </div>
    </div>
    <div class="body-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.body{
  height: 100dvh;
}
.flex {
  display: flex;
}
.nav{
  height: 100dvh;
  width: 250px;
  box-shadow: 1px 2px 5px 1px rgba(128, 128, 128, 0.281);
  padding: 10px;
  transition: all 1s;
}
.body-bar {
  position: relative;
}
.menu_icon{
  position: absolute;
  top: 10px;
  right: calc(-2em - 10px);
  z-index: 9;
  cursor: pointer;
}
.center{
  top: 42%;
}
.hidden .nav{
  width: 0 !important;
  visibility: hidden;
  opacity: 0;
  padding: 0;
  height: 0;
}

.hidden .body-content{
  width: 100% !important;
}

.body-content {
  width: calc(100% - 250px);
}

.logo {
  height: 100px;
}

.logo_web {
  align-items: center;
}

.menu {
  height: calc(100% - 180px);
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
  margin-top: 10px;
}

.menu_item {
  padding: 15px 20px;
  padding-left: 10px;
  display: flex;
  border: 1px solid rgba(170, 170, 170, 0);
  transition: all 0.5s;
  background-color: rgba(0, 255, 255, 0.123);
}

.menu_item:hover {
  background-color: antiquewhite;
  cursor: pointer;
}

.menu_item i {
  font-size: 1.5em;
}

li .button {
  display: flex;
  align-items: center;
}

li .button span {
  padding-left: 5px;
}

.user {
  height: 80px;
}

.body-content {
  padding: 10px;
}

.user_profile {
  border: 1px solid rgba(170, 170, 170, 0.226);
  padding: 10px;
  align-items: center;
}

@media (min-width: 1024px) {}
</style>
