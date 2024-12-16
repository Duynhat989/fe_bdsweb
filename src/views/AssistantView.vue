<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { encodeId } from '@/utils/encoding';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
const router = useRouter();
const assistants = ref([]);
const searchAssistants = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const total = ref(0);
const isLoading = ref(false)
const searchQuery = ref('');
let timeout;

const fetchSuggestions = async (search) => {
  try {
    if (!search) {
      searchAssistants.value = [];
      return;
    }
    const response = await request.post(END_POINT.ASSISTANTS_SUGGEST, {
      search,
    });
    searchAssistants.value = response?.data ?? [];
  } catch (error) {
    console.error("Error fetching assistant suggestions:", error);
  }
};

const handleClick = (id) => {
  const encodedId = encodeId(id);
  router.push(`/assistant/${encodedId}`);
};
const disableWatch = ref(false);
const handleClickText = async (name) => {
  disableWatch.value = true;
  isQueryChanged.value = false;
  searchQuery.value = name; 
  await fetchAssistants(1, itemsPerPage.value, name);
  disableWatch.value = false; 
};

const fetchAssistants = async (page = currentPage.value, limit = itemsPerPage.value, search = searchQuery.value) => {
  try {
    const response = await request.get(END_POINT.ASSISTANTS_LIST, {
      params: {
        search,
        page,
        limit
      }
    });
    if (page === 1) {
      assistants.value = response.data;
    } else {
      assistants.value = [...assistants.value, ...response.data];
    }
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

const loadAssistants = async () => {
  await fetchAssistants();
  isLoading.value = true
};
const clearSearchSuggestions = () => {
  setTimeout(() => {
    isQueryChanged.value = false;
    searchAssistants.value = [];
  }, 200); 
};
const isQueryChanged = ref(false);
watch(searchQuery, (newQuery, oldQuery) => {
  if (disableWatch.value || newQuery === oldQuery) {
    return; 
  }
  try {
    clearTimeout(timeout);
  } catch (error) {}

  if (!newQuery.trim()) {
    searchAssistants.value = [];
    fetchAssistants(1, itemsPerPage.value, newQuery);
    isQueryChanged.value = false;
    return;
  }
  
  timeout = setTimeout(() => {
    fetchSuggestions(newQuery);
    isQueryChanged.value = true; 
  }, 500);
});

const handleEnter = async () => {
  if (searchQuery.value.trim()) {
    await fetchAssistants(1, itemsPerPage.value, searchQuery.value);
  }
};

const handleScroll = async () => {
  const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
  if (bottomOfWindow && currentPage.value + 1 <= total) {
    try {
      currentPage.value = Number(currentPage.value) + 1;
      await fetchAssistants(currentPage.value, itemsPerPage.value, searchQuery.value);
    } catch (error) {
      console.error('Lỗi tải thêm trợ lý:', error);
    }
  } else if (currentPage.value + 1 > total) {
    console.log('Đã tải hết dữ liệu!');
  }
};

onMounted(() => {
  loadAssistants();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>
<template>
  <div class="main-container">
    <div class="header-title">
      <h1 class="title"><i class='bx bx-brain'></i> AI Assistants</h1>
      <p style="color: white;"><strong>Trợ lý toàn năng về bất động sản</strong></p>
    </div>
    <div class="search-bar" :class="{ 'query-changed': isQueryChanged }">
      <div class="search-row">
        <i class='bx bx-search-alt-2 search-icon'></i>
        <input type="text" v-model="searchQuery"  @blur="clearSearchSuggestions" @keyup.enter="handleEnter" 
          placeholder="Nhập từ tìm kiếm trợ lý..." class="search-input" />
      </div>
      <div  class="search-results" v-if="searchAssistants.length > 0">
        <ul>
          <li v-for="(result, index) in searchAssistants" :key="index" @click="handleClickText(result.name)">
            {{ result.name }}
          </li>
        </ul>
      </div>
      <div  class="search-results" v-if='isQueryChanged && searchAssistants.length === 0'>
        <p  class="no-results">Không tìm thấy kết quả phù hợp.</p>
      </div>
    </div>

    <LoadingSpinner v-if="!isLoading" />

    <div class="main-content" v-else>
      <div class="assistant-list">
        <div class="assistant-card list-card" v-for="assistant in assistants" :key="assistant.id"
          @click="handleClick(assistant.id)">
          <div class="base-info">
            <img :src="assistant.image" alt="Assistant Image" class="assistant-image" />
            <div class="it">
              <h2 style="font-size: 16px;font-weight: 600 !important;">AI. An Phát Hưng</h2>
              <h3 style="font-size: 14px;" class="assistant-title">{{ assistant.name }}</h3>
            </div>
          </div>
          <div class="assistant-content">
            <p class="assistant-detail">{{ assistant.detail }}</p>
            <div class="likes-container">
              <span class="assistant-view">Lượt xem: {{ assistant.view + randomLikes() }}</span>
              <span class="likes">{{ randomLikes() }} <i class='bx bxs-heart' style='color:#ff0808'></i></span>
            </div>
            <button class="action-btn">Bắt đầu trò chuyện <span style="margin-left: auto;"><i
                  class='bx bx-chevron-right'></i></span></button>
          </div>
        </div>
      </div>
    </div>
    <div class="note" v-if="assistants.length == 0">
      Không tìm thấy kết quả
    </div>
  </div>
</template>

<style scoped>
.it {
  padding-left: 10px;
}

.isloading {
  height: 50vh;
  background-color: transparent;
}

.main-container .note {
  text-align: center;
  color: white;
}

.header-title {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.header-title .title {
  font-size: 30px;
  font-weight: bold;
  color: var(--color-primary);
  line-height: 40px;
}

.search-bar {
  position: relative;
  width: 60%;
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.search-row {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 20px 10px 40px;
  border: 2px solid #fff;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-radius 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
}

.query-changed .search-input {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.search-input:focus {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: #aaa;
  font-size: 14px;
}

.search-results {
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  background: #fff;
  width: 100%;
  position: absolute;
  z-index: 99;
  top: 100%;
  overflow: hidden;
  padding-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.search-results ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.search-results li {
  padding: 8px 20px;
  cursor: pointer;
}

.search-results li:hover {
  background: #f0f0f0;
  border-left: 5px solid var(--color-primary);
}

.no-results {
  margin-top: 10px;
  color: #888;
  font-size: 14px;
  text-align: center;
}

.main-container {
  width: 100%;
  padding: 0px 10%;
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
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.438);
  transform: translateY(-10px);
  border: 1px solid rgb(0, 162, 255);
}

.base-info {
  display: flex;
  align-items: center;
  background-color: #e9f2fc;
  border: 1px solid #cae4ff;
  padding: 12px 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(133, 133, 133, 0.101);
}

.assistant-card:hover .assistant-title,
.assistant-card:hover h2 {
  color: #007bff;
}

.assistant-content {
  flex: 1;
  width: 100%;
}

h3.assistant-title {
  font-size: 1.2em;
  font-weight: 500 !important;
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
  font-size: 13px !important;
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
@media (max-width: 1224px) {
  .assistant-card {
    width: calc(50% - 10px);
  }
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .assistant-card {
    width: calc(50% - 10px);
  }
}

@media (max-width: 768px) {
  .search-bar {
    width: 100%;
  }

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
  
  .main-container {
    padding: 0px 20px;
  }
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