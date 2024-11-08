<script setup>
import { ref, onMounted, computed , watch } from 'vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
const estales = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(8);
const total = ref(0);
const searchQuery = ref('');
const isLoading = ref(false)

const fetchEstates = async (page = currentPage.value, limit = itemsPerPage.value, search = searchQuery.value) => {
  try {
    const response = await request.get(END_POINT.ESTALES_LIST, {
      params: {
        page,
        limit,
        search
      }
    });
    estales.value = response.realEstates;
    total.value = response.total;
    currentPage.value = response.page;
    itemsPerPage.value = response.limit;
  } catch (error) {
    console.error('Lỗi lấy danh sách bài viết:', error);
  }
};

watch(
  searchQuery,
  (newQuery) => {
    if (newQuery) {
      fetchEstates(currentPage.value, itemsPerPage.value ,newQuery );
    } else {
      fetchEstates();
    }
  }
);

const totalPages = computed(() => {
  return Math.ceil(total.value / itemsPerPage.value);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    if (searchQuery.value) {
      fetchEstates(currentPage.value, itemsPerPage.value ,searchQuery.value );
    } else {
      fetchEstates(currentPage.value, itemsPerPage.value);
    }
  }
};
const loadEstates = async () => {
    await fetchEstates();
    isLoading.value = true
};

onMounted(() => {
  loadEstates();
});
</script>

<template>
  <LoadingSpinner v-if="!isLoading" />
  <div class="real-estate-search" v-else>
    <div class="header">
      <div class="header-title">
        <h1 class="title">Tìm kiếm bất động sản</h1>
        <p>Khám phá các lựa chọn bất động sản phù hợp với nhu cầu của bạn.</p>
      </div>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Nhập từ khóa tìm kiếm..."
          class="search-input"
        />
      </div>
    </div>
    <div class="results">
      <div class="result-box" v-for="item in estales" :key="item.id">
          <img :src="item.image" alt="Property Image" class="item-image" />
          <div class="result-detail">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-location">{{ item.location }}</p>
            <p class="item-description">{{ item.description }}</p>
            <p class="item-more"><strong>Giá:</strong> {{ item.price }}</p>
            <p class="item-more"><strong>Diện tích:</strong> {{ item.area }}</p>
            <p class="item-more">
              <strong>Tiện ích:</strong>
              {{ item.exten }}
            </p>
          </div>
          <a :href="item.base_url" target="_blank" class="item-link">
              Xem chi tiết
          </a>
      </div>

    </div>
    <div class="pagination">
        <span @click="changePage(page)" v-for="(page, index) in totalPages" :class="{ active: currentPage === page }"
          class="page-number">
          {{ page }}</span>
      </div>
  </div>
</template>

<style scoped>
.real-estate-search {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 40px;
  margin-top: 40px;
}
.search-bar {
  margin: 20px 0;
  text-align: center;
}

.search-input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.header-title {
  text-align: center;
}

.header-title .title {
  font-size: 30px;
  font-weight: bold;
  color: #e03d31;
  line-height: 40px;
  margin-bottom: 10px;
}

.title {
  font-size: 24px;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
  position: relative;
}

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter-item label {
  font-size: 14px;
  margin-bottom: 5px;
}

.filter-item select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: inherit;
}

.filter-apply {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  margin-top: 26px;
}

.filter-apply:hover {
  background-color: #a02822;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: start; 
  box-sizing: border-box;
}
.result-box {
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  padding: 15px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}
.result-detail {
  height: 180px;
  overflow-y: auto;
  scrollbar-width: none;
}
.result-box:hover {
  border: 1px solid var(--color-primary);
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.item-name {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.item-location {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
}
.item-more,
.item-description {
  font-size: 14px;
  color: #555;
}
.item-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
}
.item-more strong {
  color: var(--color-primary);
}
.item-link {
  display: block;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: #fff;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
}
.item-link:hover {
  opacity: 0.8;
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
  background-color: var(--color-primary);
  color: #fff;
}
/* Responsive Styles */
@media (max-width: 1024px) {
  .results {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .filters {
    gap: 10px;
    margin: 10px 0;
  }
}

@media (max-width: 768px) {
  .results {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .filters {
    gap: 10px;
    margin: 10px 0;
    justify-content: flex-start;
  }

}

@media (max-width: 576px) {
  .results {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
