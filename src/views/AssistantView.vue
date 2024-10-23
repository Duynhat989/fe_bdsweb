<script setup>
import { ref, computed } from 'vue';
const viewType = ref('list');
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
const setView = (type) => {
  viewType.value = type;
};
const assistants = ref([
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 1',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 2',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 3',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 4',
  },
  {
    image: 'https://file4.batdongsan.com.vn/crop/393x222/2024/09/13/20240913223403-9018_wm.jpg',
    title: 'Bất động sản 5',
  },
  {
    image: 'https://mahamangala.vn/aidu/team.png',
    title: 'Bất động sản 6',
  },
]);
const currentPage = ref(1);
const itemsPerPage = ref(8);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return assistants.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(assistants.value.length / itemsPerPage.value);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>
<template>
  <div class="main-container">
    <div class="change-type">
      <button @click="setView('list')" :class="{ active: viewType === 'list' }">Danh sách</button>
      <button @click="setView('slide')" :class="{ active: viewType === 'slide' }">Slide</button>
    </div>
    <div class="main-title">
      <h1 class="title">Bất động sản Hưng Thịnh Hỏi đáp trợ lý</h1>
      <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
    </div>
    <div class="main-content">
      <div v-if="viewType === 'list'" class="assistant-list">
        <div v-for="(assistant, index) in paginatedItems" :key="index" class="assistant-card list-card">
          <div class="assistant-section">
            <img :src="assistant.image" alt="assistant image" />
            <div class="assistant-info">
              <h3 class="assistant-title">{{ assistant.title }}</h3>
            </div>
            <div class="favorite-section">
              <i class="bx bx-heart"></i>
            </div>
          </div>
        </div>
        <div class="pagination">
          <span @click="changePage(page)" v-for="(page, index) in totalPages" :class="{ active: currentPage === page }"
            class="page-number">
            {{ page }}</span>
        </div>
      </div>
      <carousel v-if="viewType === 'slide'" :items-to-show="4" class="assistant-slide">
        <slide v-for="(assistant, index) in assistants" class="assistant-card slide-card" :key="index">
          <div class="assistant-section">
            <img :src="assistant.image" alt="assistant image" />
            <div class="assistant-info">
              <h3 class="assistant-title">{{ assistant.title }}</h3>
            </div>
            <div class="favorite-section">
              <i class="bx bx-heart"></i>
            </div>
          </div>
        </slide>
        <template #addons>
          <Pagination />
          <navigation>
            <template #next>
              <span class="nav-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
                  <path fill="currentColor"
                    d="m50.868 78.016l36.418-26.055a2.52 2.52 0 0 0 1.051-2.043v-.006a2.52 2.52 0 0 0-1.059-2.048L50.86 21.977a2.51 2.51 0 0 0-2.612-.183a2.51 2.51 0 0 0-1.361 2.236v12.183l-32.709-.001a2.514 2.514 0 0 0-2.515 2.516l.001 22.541a2.515 2.515 0 0 0 2.516 2.516h32.706v12.187c0 .94.53 1.803 1.366 2.237a2.51 2.51 0 0 0 2.616-.193" />
                </svg>
              </span>
            </template>
            <template #prev>
              <span class="nav-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
                  <path fill="currentColor"
                    d="M49.132 21.984L12.714 48.039a2.52 2.52 0 0 0-1.051 2.043v.006a2.52 2.52 0 0 0 1.059 2.048L49.14 78.023a2.51 2.51 0 0 0 2.612.183a2.51 2.51 0 0 0 1.361-2.236V63.787l32.709.001a2.514 2.514 0 0 0 2.515-2.516l-.001-22.541a2.515 2.515 0 0 0-2.516-2.516H53.114V24.029c0-.94-.53-1.803-1.367-2.237a2.51 2.51 0 0 0-2.615.192" />
                </svg>
              </span>
            </template>
          </navigation>
        </template>
      </carousel>
    </div>
  </div>

</template>

<style scoped>
.main-title {
  text-align: center;
}

.main-container {
  max-width: 1300px;
  margin: 5px auto;
  position: relative;
}

.change-type button {
  margin: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.change-type button.active {
  background-color: #e03d31;
  color: white;
}

.change-type {
  position: absolute;
  top: 0;
  right: 0;
}

.main-content {
  width: 100%;
}

.assistant-list {
  display: flex;
  margin: 30px auto;
  flex-wrap: wrap;
  gap: 15px;
}

.assistant-slide {
  margin: 30px auto;
}

.pagination {
  width: 100%;
  margin-top: 20px;
}

.pagination span {
  padding: 10px 15px;
  background-color: #ccc;
  color: #111;
  margin: 0px 5px;
  cursor: pointer;
}

.pagination span.active,
.pagination span:hover {
  background-color: #e03d31;

  color: #fff;
}

.assistant-card {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.assistant-card:hover {
  transform: scale(1.02);
}
.list-card {
  display: flex;
  padding: 10px;
  align-items: center;
  flex-direction: column;
  width: calc((100% - 45px)/4);
}


.assistant-section {
  position: relative;
  width: 100%;
}

.assistant-section img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}



.assistant-info {
  padding: 15px;
}

.assistant-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  line-height: 1.4;
}

.favorite-section {
  padding: 10px;
  text-align: right;
  background-color: #f9f9f9;
}

.favorite-section i {
  color: #ccc;
  cursor: pointer;
  font-size: 20px;
}

.favorite-section i:hover {
  color: #e03d31;
}

.slide-card {
  display: block;
  padding: 10px;
  text-align: center;
  margin: 0 5px;
}

.slide-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.nav-left,
.nav-right {
  padding: 5px 5px;
  background: #e03d31;
  color: #fff;
  display: flex;
  border-radius: 50%;
}
</style>
