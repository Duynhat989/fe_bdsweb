<script setup>
import { ref, computed, onMounted } from 'vue';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRouter } from 'vue-router';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { encodeId } from '@/utils/encoding';
const router = useRouter();
const viewType = ref('list');
const assistants = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const total = ref(0);

const handleClick = (id) => {
  const encodedId = encodeId(id);
  router.push(`/assistant/${encodedId}`);
};

const fetchAssistants = async (page = currentPage.value, limit = itemsPerPage.value) => {
  try {
    const response = await request.get(END_POINT.ASSISTANTS_LIST, {
      params: {
        page,
        limit
      }
    });
    assistants.value = response.data;
    total.value = response?.total ?? 1;
    currentPage.value = response?.page ?? 1;
    itemsPerPage.value = response?.limit ?? 10;
  } catch (error) {
    console.error('Lỗi lấy danh sách trợ lý:', error);
  }
};

const setView = (type) => {
  viewType.value = type;
};
const totalPages = computed(() => {
  return Math.ceil(total.value / itemsPerPage.value);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAssistants(currentPage.value, itemsPerPage.value);
  }
};

const itemsToShow = computed(() => {
  if (window.innerWidth < 768) {
    return 1;
  } else if (window.innerWidth < 1024) {
    return 2;
  } else {
    return 3;
  }
});
const loadAssistants = async () => {
    await fetchAssistants();
};
onMounted(() => {
  loadAssistants();
});

</script>
<template>
  <div class="main-container">
    <div class="change-type">
      <button @click="setView('list')" :class="{ active: viewType === 'list' }">Danh sách</button>
      <button @click="setView('slide')" :class="{ active: viewType === 'slide' }">Slide</button>
    </div>
    <div class="header-title">
      <h1 class="title">Hỏi đáp trợ lý</h1>
      <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
    </div>
    <div class="main-content">
      <div v-if="viewType === 'list'" class="assistant-list">
        <div class="assistant-card list-card" v-for="assistant in assistants" :key="assistant.id"
          @click="handleClick(assistant.id)">
          <img :src="assistant.image" alt="Assistant Image" class="assistant-image" />
          <div class="assistant-content">
            <h3 class="assistant-title">{{ assistant.name }}</h3>
            <p class="assistant-detail">{{ assistant.detail }}</p>
            <span class="assistant-view">Lượt xem: {{ assistant.view }}</span>
          </div>
        </div>
        <div class="pagination">
          <span v-for="page in totalPages" :key="page" @click="changePage(page)"
            :class="{ active: currentPage === page }" class="page-number">
            {{ page }}
          </span>
        </div>
      </div>
      <carousel v-if="viewType === 'slide' && assistants.length > 0" :items-to-show="itemsToShow"
        class="assistant-slide">
        <slide class="assistant-card slide-card" v-for="assistant in assistants" :key="assistant.id"
          @click="handleClick(assistant.id)">
          <img :src="assistant.image" alt="Assistant Image" class="assistant-image" />
          <div class="assistant-content">
            <h3 class="assistant-title">{{ assistant.name }}</h3>
            <p class="assistant-detail">{{ assistant.detail }}</p>
            <span class="assistant-view">Lượt xem: {{ assistant.view }}</span>
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
.header-title {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.header-title .title {
  font-size: 30px;
  font-weight: bold;
  color: #e03d31;
  line-height: 40px;
}

.main-container {
  padding: 0 5%;
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

.list-card {
  display: flex;
  padding: 10px;
  align-items: center;
  flex-direction: column;
  width: calc((100% - 45px)/4);
}

.assistant-card:hover {
  transform: scale(1.02);
}

.assistant-card {
  background: #fff;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.assistant-card:hover {
  transform: scale(1.05);
}

.assistant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.assistant-content {
  padding: 10px;
}

.assistant-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
}

.assistant-detail {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assistant-view {
  font-size: 12px;
  color: #777;
}

.slide-card {
  display: block;
  padding: 10px;
  text-align: center;
  margin: 10px 10px;
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

/* Responsive Styles */
@media (max-width: 1200px) {
  .main-container {
    max-width: 1000px;
  }
}

@media (max-width: 1024px) {
  .main-container {
    max-width: 800px;
    padding: 10px;
  }

  .list-card {
    width: calc((100% - 30px)/3);
  }
}

@media (max-width: 768px) {
  .main-container {
    max-width: 600px;
  }

  .list-card {
    width: calc((100% - 30px)/2);
  }
}

@media (max-width: 576px) {
  .main-container {
    max-width: 100%;
  }

  .list-card {
    width: 100%;
  }
}
</style>
