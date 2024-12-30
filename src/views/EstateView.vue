<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import Pagination from '@/components/Pagination.vue';
import EstateDetailPopup from '@/components/EstateDetailPopup.vue';
import { getLatestPrice } from '@/utils/helps';
const estales = ref([]);
const searchSuggestions = ref([]);
const provinces = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(8);
const total = ref(0);
const searchQuery = ref('');
const isLoading = ref(false)
const isInitialLoad = ref(true); 
const selectedEstate = ref(null);
// change selected
const provinceRange = ref('');
const transactionType = ref('');
const priceRange = ref('');
const areaRange = ref('');
const isPopupVisible = ref(false);

const openPopup = (estate) => {
    selectedEstate.value = estate;
    isPopupVisible.value = true;
};

const closePopup = () => {
    isPopupVisible.value = false;
};

const handleClickText = async (name) => {
  searchQuery.value = name; 
  searchSuggestions.value = [];
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.focus();
  }
};
const clearSearchSuggestions = () => {
  setTimeout(() => {
    searchSuggestions.value = [];
  }, 200); 
};

const fetchSearchSuggestions = async (name) => {
  if (!name.trim()) {
    searchSuggestions.value = [];
    return;
  }
  try {
    const [nameResponse, locationResponse] = await Promise.all([
      request.get(END_POINT.ESTALE_NAME, { params: { name } }),
      request.get(END_POINT.ESTALE_LOCATION, { params: { location: name } }),
    ]);
    searchSuggestions.value = [
      ...(nameResponse.data || []).map((item) => ({
        title: item.title,
      })),
      ...(locationResponse.data || []).map((item) => ({
        title: item.location,
      })),
    ];
  } catch (error) {
    console.error('Lỗi lấy gợi ý tìm kiếm:', error);
  }
};

const fetchEstates = async (
    page = currentPage.value,
    limit = itemsPerPage.value,
    search = searchQuery.value,
    province = provinceRange.value,
    type = transactionType.value,
    max_price = priceRange.value,
    area = areaRange.value
  ) => {
  try {
    isLoading.value = true;
    const response = await request.get(END_POINT.ESTALES_LIST, {
      params: {
        page,
        limit,
        search,
        province,
        type,
        max_price,
        area
      }
    });
    estales.value = response.realEstates;
    total.value = response.total;
    currentPage.value = response.page;
    itemsPerPage.value = response.limit;
  } catch (error) {
    console.error('Lỗi lấy danh sách bài viết:', error);
  }finally {
      isInitialLoad.value = false;
      isLoading.value = false; 
  }
};
const fetchsProvince = async () => {
  try {
    const response = await request.get(END_POINT.ESTALE_PROVINCE);
    provinces.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách vị trí:', error);
  }
};
let timeout;
watch(
  [searchQuery],
  ([newQuery]) => {
    try {
      clearTimeout(timeout);
    } catch (error) {}
    timeout = setTimeout(() => {
      if (newQuery.trim()) {
        fetchSearchSuggestions(newQuery);
      } else {
        searchSuggestions.value = [];
      }
    }, 1500);
  }
);

watch(
  [provinceRange, transactionType, priceRange, areaRange],
  ([newProvince, newTransactionType, newPriceRange, newAreaRange]) => {
    fetchEstates(
      currentPage.value,
      itemsPerPage.value,
      searchQuery.value.trim(),
      newProvince,
      newTransactionType,
      newPriceRange,
      newAreaRange
    );
  }
);

const onSearch = () => {
  searchSuggestions.value = [];
  if (!searchQuery.value.trim() && !provinceRange.value && !transactionType.value && !priceRange.value && !areaRange.value) {
    estales.value = [];
    isInitialLoad.value = true; 
    return;
  }
  timeout = setTimeout(() => {
    fetchEstates(
      currentPage.value,
      itemsPerPage.value,
      searchQuery.value.trim(), 
      provinceRange.value,
      transactionType.value,
      priceRange.value,
      areaRange.value
    );
  }, 1000);
};

const changePage = (page) => {
  currentPage.value = page;
  fetchEstates(currentPage.value, itemsPerPage.value, searchQuery.value, provinceRange.value, transactionType.value,);
};

onMounted(() => {
  fetchsProvince();
});
</script>

<template>
  <div class="main-container"  :class="isInitialLoad ? 'initial-load' : ''">
    <div class="header">
      <div class="header-title">
        <h1 class="title">Tìm kiếm bất động sản</h1>
        <p >Khám phá các lựa chọn bất động sản phù hợp với nhu cầu của bạn.</p>
      </div>
      <div class="search-bar">
          <div class="search-box">
            <div class="search-row">
              <div class="search-input">
                <i class='bx bx-search-alt-2 search-icon'></i>
                <input type="text" v-model="searchQuery"  :class="{ 'active-search': searchSuggestions.length > 0 }"  @blur="clearSearchSuggestions" placeholder="Nhập các yêu cầu bất động sản. VD: Địa điểm, phòng, view,..."  />
                <div class="search-results" v-if="searchSuggestions.length > 0">
                  <ul>
                    <li v-for="(suggestion, index) in searchSuggestions" :key="index" @click="handleClickText(suggestion.title)">
                      {{ suggestion.title }}
                    </li>
                  </ul>
                </div>
              </div>
              <button @click="onSearch" class="search-button">Tìm kiếm</button>
            </div>
          </div>
          <div class="filter-row">
              <select class="search-select"  v-model="transactionType">
                  <option value="">Chọn loại giao dịch</option>
                  <option value="buy">Mua & Bán</option>
                  <option value="rent">Thuê</option>
              </select>
              <select class="search-select" v-model="provinceRange">
                <option value="">Chọn vị trí</option>
                <option v-for="(item,index) in provinces" :key="index" :value="item.province">
                  {{ item.province }}
                </option>
              </select>
              <select class="search-select" v-model="areaRange">
                  <option value="">Chọn diện tích</option>
                  <option value="0-50">Dưới 50 m²</option>
                  <option value="50-100">50 - 100 m²</option>
                  <option value="100-200">100 - 200 m²</option>
                  <option value="200-500">200 - 500 m²</option>
                  <option value="500-">Trên 500 m²</option>
              </select>
              
              <select class="search-select" v-model="priceRange" v-if="transactionType == 'rent'">
                <option value="">Chọn mức giá</option>
                <option value="5">Dưới 4 triệu</option>
                <option value="8">Dưới 8 triệu</option>
                <option value="10">Dưới 10 triệu</option>
              </select> 
              <select class="search-select" v-model="priceRange" v-else>
                <option value="">Chọn mức giá</option>
                <option value="500">Dưới 500 triệu</option>
                <option value="1000">Dưới 1 tỷ</option>
                <option value="10000">Dưới 10 tỷ</option>
                <option value="20000">Dưới 20 tỷ</option>
                <option value="50000">Dưới 50 tỷ</option>
                <option value="100000">Dưới 100 tỷ</option>
                <option value="500000">Dưới 500 tỷ</option>
              </select>
          </div>
      </div>
    </div>
    <div v-if="estales.length > 0" >
      <LoadingSpinner v-if="isLoading" />
      <div v-else >
        <div class="results" >
          <div class="result-box" v-for="item in estales" :key="item.id">
            <img :src="item.image" alt="Property Image" class="item-image" />
            <div class="result-detail">
              <h3 class="item-name"><i class='bx bx-home' style='color:#2b2a2a' ></i>: {{ item.title }}</h3>
              <p class="item-location"><i class='bx bx-map-pin' style='color:#2b2a2a'  ></i>: {{ item.location }}</p>
              <p class="item-description"><i class='bx bx-buildings' style='color:#2b2a2a' ></i>: {{ item.description }}</p>
              <p class="item-more"><strong>Giá: </strong> <span style="color: red;">{{ getLatestPrice(item.price) }}</span></p>
              <p class="item-more"><strong>Diện tích: </strong><span style="color: red;">{{ item.area }}</span> </p>
              <p class="item-more">
                <strong>Tiện ích:</strong>
                {{ item.exten }}
              </p>
            </div>
            <span @click="openPopup(item)" class="item-link">Xem chi tiết</span>
            <a :href="item.base_url" target="_blank"  class="item-link">Link gốc</a>
          </div>
        </div>
        <Pagination
          :total="total"
          :itemsPerPage="itemsPerPage"
          :currentPage="currentPage"
          @changePage="changePage"
        />
      </div>
    </div>
    <div class="note" v-else-if="!isInitialLoad">
        Không tìm thấy kết quả
    </div>
  </div>
  <EstateDetailPopup :estate="selectedEstate" :visible="isPopupVisible" @close="closePopup" />
</template>

<style scoped>
.note {
    text-align: center;
    color: white;
  font-size: 18px;
}
.isloading {
    height: 50vh;
    background-color: transparent;
}
.main-container {
  max-width: 1200px;
  width: 100%; 
  margin: 0 auto;
  padding: 0px 5%;
}
.initial-load {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-top: 0px!important;
}
.header {
  background-color: #f8f9fa; 
  padding: 20px 20px;
  border-radius: 30px;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.header-title h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header-title p {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 600 !important;
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  position: relative;
}

.search-input input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-icon {
  font-size: 20px;
  color: #888;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  z-index: 10;
  overflow: hidden;
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
  padding: 5px 20px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.search-results li:hover {
  background: #f0f0f0;
  border-left: 5px solid var(--color-primary);
}

.search-results li:last-child {
  border-bottom: none;
}

.search-results li:hover {
  background-color:  var(--color-primary);
  color: white;
}

.search-button {
  padding: 10px 20px;
  background-color:  var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover {
  background-color: #cd1313;

}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  outline: none;
  appearance: none;
  position: relative;
  background: #f9f9f9 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%23333'/%3E%3C/svg%3E") no-repeat right 10px center;
  background-size: 12px;
  padding-right: 10px;
  cursor: pointer;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
  align-items: start;
  box-sizing: border-box;
}

.result-box {
  max-width: 300px;
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  padding: 15px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s;
  border: 1px solid white;
  cursor: pointer;
}

.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.result-detail {
  height: 250px;
  overflow-y: auto;
  scrollbar-width: none;
  margin-bottom: 20px;
}

.item-name {
  font-size: 15px;
  color: #000000;
  font-weight: 400 !important;
  margin-bottom: 5px;
}

.item-location{
  font-size: 11px;
  color: #000000;
  font-weight: 400 !important;
  margin-bottom: 10px;
}
.item-location,
.item-description,
.item-more {
  font-size: 12px;
  color: #555;
}
.item-description {
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
}

.link-root {
  color: #4a90e2;
  text-decoration: underline;
}
.item-link {
  display: block;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: #fff;
  text-align: center;
  border-radius: 20px;
  margin-top: 10px;
  border: none;
  width: 100%;
  font-size: 12pz  ;
}

.item-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .main-container {
    width: 100%; 
    padding: 0px 5%;
  }

  .header-title h1 {
    font-size: 24px;
  }

  .header-title p {
    font-size: 14px;
  }

  .search-bar {
    gap: 10px;
  }

  .search-button {
    font-size: 14px;
    line-height: 20px;
    padding: 8px 16px;
  }
  .search-input {
    padding: 8px 16px;
  }
  .search-input input,
  .search-select {
    font-size: 14px;
  }
  
  .result-box {
    max-width: 100%;
    width: 100%;
  }
}
</style>