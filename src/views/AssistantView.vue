<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import 'vue3-carousel/dist/carousel.css'
import { useRouter } from 'vue-router';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { encodeId } from '@/utils/encoding';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import PaginationView from '@/components/Pagination.vue';
const router = useRouter();
const viewType = ref('list');
const assistants = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(6);
const total = ref(0);
const isLoading = ref(false)


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

const randomLikes = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// const totalPages = computed(() => {
//   return Math.ceil(total.value / itemsPerPage.value);
// });

const changePage = (page) => {
  currentPage.value = page;
  fetchAssistants(currentPage.value, itemsPerPage.value);
};

const itemsToShow = ref(3);

const updateItemsToShow = () => {
  if (window.innerWidth < 768) {
    itemsToShow.value = 1;
  } else if (window.innerWidth < 1024) {
    itemsToShow.value = 2;
  } else {
    itemsToShow.value = 3;
  }
};

const loadAssistants = async () => {
  await fetchAssistants();
  isLoading.value = true
};
onMounted(() => {
  loadAssistants();
  updateItemsToShow();
  window.addEventListener('resize', updateItemsToShow);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateItemsToShow);
});
</script>
<template>
  <LoadingSpinner v-if="!isLoading" />
  <div class="main-container" v-else>
    <div class="change-type">
      <button class="list">Danh sách</button>
    </div>
    <div class="header-title">
      <h1 class="title"><i class='bx bx-brain'></i> AI Assistants</h1>
      <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản An Phát Hưng.</p>
    </div>
    <div class="main-content">
      <div class="assistant-list">
        <div class="assistant-card list-card" v-for="assistant in assistants" :key="assistant.id"
          @click="handleClick(assistant.id)">
          <div class="base-info">
            <img :src="assistant.image" alt="Assistant Image" class="assistant-image" />
            <h3 class="assistant-title">{{ assistant.name }}</h3>
          </div>
          <div class="assistant-content">
            <p class="assistant-detail">{{ assistant.detail }}</p>
            <div class="likes-container">
              <span class="assistant-view">Lượt xem: {{ assistant.view + randomLikes() }}</span>
              <span class="likes">{{ randomLikes() }} <i class='bx bxs-heart' style='color:#ff0808'  ></i></span>
            </div>
            <button class="action-btn">Bắt đầu trò chuyện <span style="margin-left: auto;"><i
                  class='bx bx-chevron-right'></i></span></button>
          </div>
        </div>
        <PaginationView :total="total" :itemsPerPage="itemsPerPage" :currentPage="currentPage"
          @changePage="changePage" />
      </div>
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
  color: var(--color-primary);
  line-height: 40px;
}

.main-container {
  width: 100%;
  padding: 20px 5%;
  margin: 5px auto;
  position: relative;
}


.change-type {
  position: absolute;
  right: 10px;
}

.change-type button {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  background-color: var(--color-primary);
  color: #fff;
}

.header-title .title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.header-title p {
  font-size: 16px;
  color: #555;
}

.assistant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.assistant-card {
  background-color: #fff;
  width: calc((100% - 30px)/3);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.256);
  border: 1px solid rgba(128, 128, 128, 0.266);
  /* display: flex; */
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.assistant-image {
  width: 80px;
  height: 80px;
  border-radius: 15px;
  margin-right: 15px;
  transition: transform 0.3s ease;
  object-fit: cover;
}

.assistant-card:hover .assistant-image {
  transform: scale(1.1);
}

.assistant-card:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.299);
  transform: translateY(-5px);
  border: 1px solid rgba(128, 128, 128, 0.266);
}

.base-info {
  display: flex;
  align-items: center;
  background-color: #d4e9ff66;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.101);
}

.assistant-card:hover .assistant-title {
  color: #007bff;
}

.assistant-content {
  flex: 1;
  width: 100%;
}

.assistant-title {
  font-size: 1.2em;
  font-weight: normal;
  color: #333;
}

.assistant-role {
  font-size: 14px;
  color: var(--color-primary);
  margin-top: 4px;
}

.assistant-detail {
  font-size: 14px;
  color: #555;
  margin: 10px 0;
  margin-top: 15px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
}

.assistant-view {
  font-size: 13px;
  color: #999;
}

.likes-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

.likes {
  font-size: 14px;
  color: #333;
}

.action-btn {
  /* background-color: #007bff; */
  color: #007bff;
  /* font-weight: 400 !important; */
  font-size: medium;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-btn:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.05);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .assistant-card {
    width: calc(50% - 10px);
  }
}

@media (max-width: 768px) {
  .assistant-card {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .assistant-image {
    width: 50px;
    height: 50px;
    margin: 0 0 10px 0;
  }

  .assistant-title {
    font-size: 16px;
  }

  .assistant-detail {
    font-size: 14px;
  }

  .likes-container {
    justify-content: space-between;
    width: 100%;
  }

  .action-btn {
    padding: 5px 8px;
  }
}

@media (max-width: 480px) {
  .header-title .title {
    font-size: 20px;
  }

  .header-title p {
    font-size: 14px;
  }

  .assistant-title {
    font-size: 14px;
  }

  .assistant-detail,
  .assistant-view {
    font-size: 12px;
  }

  .action-btn {
    padding: 5px;
    font-size: 12px;
  }
}
</style>
