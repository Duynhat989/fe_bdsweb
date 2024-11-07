<script setup>
//stream data ở đây nha
import HeaderView from "@/components/home/Header.vue";
import MsgContentView from "@/components/chat/Layout.vue";
// let lst = ref([]);


import { ref, onMounted } from "vue";
import { listHisData } from "../../interact/gemini";

const lstHistory = ref([])

const loadHistory = async () => {
    var his = await listHisData()
    if (his.status) {
        lstHistory.value = his.data
        console.log(lstHistory.value)
    }
}

onMounted(() => {
    loadHistory()
})

const isShow = ref(false)

</script>

<template>
  <div class="site">
    <div class="container">
      <div class="site-content">
        <HeaderView />
        <div :class="isShow ? `chat flex` : `chat hiddens flex`">
          <div class="chat-nav">
            <div class="fontchat">
              <div class="chat-new">
                <div class="new-data">
                  <a><i class='bx bx-layer-plus'></i> new chat</a>
                </div>
              </div>
              <label for="" style="padding: 5px;">Lịch sử</label>
              <ul class="menu-bar">
                <li class="line" v-for="(item,index) of lstHistory">
                  <a><i class='bx bx-message-square-dots'></i> {{ item.id }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="soft">
            <button @click="isShow = !isShow">
              <i v-if="isShow" class='bx bxs-chevron-left'></i>
              <i v-else class='bx bxs-chevron-right'></i>
            </button>
          </div>
          <div class="chat-msg">
            <!-- sfds -->
            <MsgContentView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.site{
  padding: 0 10px;
}
.container {
  max-width: 1250px;
  margin: auto;
}

.chat {
  justify-content: center;
  position: relative;
  transition: all 1s;
}

.chat-nav {
  width: 220px;
  margin-top: 50px;
}

.chat-msg {
  transition: all 1s;
  width: 100%;
}

.hiddens .chat-nav {
  display: none;
}

.hidden .chat-msg {
  width: 100%;
}

.chat-new {
  margin-bottom: 20PX;
}

.chat ul {
  margin: 0;
  padding: 0;
}

.chat li {
  list-style: none;
  margin-bottom: 5px;
}

.chat a {
  background: rgba(68, 68, 68, 0.185);
  padding: 8px;
  display: block;
  text-decoration: none;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 7px;
  transition: all 0.5s;
  text-align: center;
}

.menu-bar {
  padding-top: 10px !important;
}

.menu-bar a {
  padding: 7px;
}

.chat a:hover {
  background: rgba(68, 68, 68, 0.342);
}

.soft {
  position: absolute;
  top: -20px;
  left: 0;
  z-index: 999999;
}

.soft button {
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .chat-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    background: #08080ab9;
    margin: 0;
  }

  .fontchat {
    width: 250px;
    background: #08080a;
    padding: 10px;
    padding-top: 75px;
    min-height: 100vh;
    border: 1px solid rgba(94, 94, 94, 0.603);
    border-radius: 0 10px 10px 0;
  }

  .chat-msg {
    width: 100%;
  }

  .soft {
    position: fixed;
    top: 20px;
    left: 0;
    z-index: 999999;
  }

  .hiddens .soft {
    top: 60px;
  }
}
</style>
