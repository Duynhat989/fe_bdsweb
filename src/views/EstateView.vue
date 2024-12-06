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
const selectedEstate = ref(null);
// change selected
const location = ref('');
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
const fetchEstates = async (
    page = currentPage.value,
    limit = itemsPerPage.value,
    search = searchQuery.value,
    province = location.value,
    type = transactionType.value,
    price = priceRange.value,
    area = areaRange.value
  ) => {
  try {
    const response = await request.get(END_POINT.ESTALES_LIST, {
      params: {
        page,
        limit,
        search,
        province,
        type,
        price,
        area
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
  [searchQuery, location, transactionType, priceRange, areaRange],
  ([newQuery, newLocation, newType, newPrice, newArea]) => {
    isLoading.value = false;
    try {
      clearTimeout(timeout);
    } catch (error) {}

    timeout = setTimeout(() => {
      fetchEstates(currentPage.value, itemsPerPage.value, newQuery, newLocation, newType, newPrice, newArea);
      isLoading.value = true;
    }, 1000);
  }
);

const changePage = (page) => {
  currentPage.value = page;
  fetchEstates(currentPage.value, itemsPerPage.value, searchQuery.value, location.value, transactionType.value,);
};

const loadEstates = async () => {
  await fetchEstates();
  isLoading.value = true
  await fetchsProvince();
};
onMounted(() => {
  loadEstates();
});
</script>

<template>
  <div class="main-container">
    <div class="header">
      <div class="header-title">
        <h1 class="title">Tìm kiếm bất động sản</h1>
        <p style="color: white;">Khám phá các lựa chọn bất động sản phù hợp với nhu cầu của bạn.</p>
      </div>
      <div class="search-bar">
          <div class="search-box">
            <div class="search-row">
                <i class='bx bx-search-alt-2 search-icon'></i>
                <input type="text" v-model="searchQuery"  :class="{ 'active-search': searchSuggestions.length > 0 }" placeholder="Nhập từ khóa tìm kiếm..." class="search-input" />
            </div>
            <div class="search-results" v-if="searchSuggestions.length > 0">
              <ul>
                <li v-for="(suggestion, index) in searchSuggestions" :key="index" @click="selectSuggestion(suggestion)">
                  {{ suggestion.title }}
                </li>
              </ul>
            </div>
          </div>
          <div class="filter-row">
              <select class="search-select" v-model="location">
                <option value="">Chọn vị trí</option>
                <option v-for="(province,index) in provinces" :key="index" :value="province.province">
                  {{ province.province }}
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
              <select class="search-select"  v-model="transactionType">
                  <option value="">Chọn loại giao dịch</option>
                  <option value="buy">Mua & Bán</option>
                  <option value="rent">Thuê</option>
              </select>
              <select class="search-select" v-model="priceRange">
                  <option value="">Chọn mức giá</option>
                  <option value="0-500">Dưới 500 triệu</option>
                  <option value="500-1000">500 triệu - 1 tỷ</option>
                  <option value="1000-2000">1 tỷ - 2 tỷ</option>
                  <option value="2000-5000">2 tỷ - 5 tỷ</option>
                  <option value="5000-">Trên 5 tỷ</option>
              </select>
             
          </div>
      </div>
    </div>
    <LoadingSpinner v-if="!isLoading" />
    <div v-else>
      <div v-if="estales.length > 0">
          <div class="results" v-if="estales.length > 0">
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
              <button @click="openPopup(item)" class="item-link">Xem chi tiết</button>
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
    <div class="note" v-if="estales.length == 0">
        Không tìm thấy kết quả
    </div>
  </div>
  <EstateDetailPopup :estate="selectedEstate" :visible="isPopupVisible" @close="closePopup" />

</template>

<style scoped>
.main-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0px 20px;
  text-align: center;
}
.note {
    text-align: center;
    color: white;
}
.isloading {
    height: 50vh;
    background-color: transparent;
}
.header {
  margin-bottom: 40px;
  margin-top: 40px;
}
.search-row {
    position: relative;
    width: 100%;
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
  text-align: left;
  cursor: pointer;
}

.search-results li:hover {
  background: #f0f0f0;
  border-left: 5px solid var(--color-primary);
}

.filter-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
}
.search-select {
    padding: 10px 15px;
    border: 2px solid #fff;
    border-radius: 25px;
    font-size: 16px;
    background-color: white;
    outline: none;
    transition: border-color 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    color: #333;
    cursor: pointer;
    flex: 1;
    max-width: fit-content;
}

.search-select:focus {
    border-color: #4a90e2;
}
.search-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 60%;
    margin: 0 auto;
}
.search-box {
  width: 100%;
  position: relative;
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
    transition: all 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.search-input.active-search {
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

.header-title {
  text-align: center;
}

.header-title .title {
  font-size: 24px;
  font-weight: bold;
  color: #e03d31;
  line-height: 40px;
  margin-bottom: 10px;
}

.title {
  font-size: 26px;
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
  gap: 10px;
  align-items: start;
  box-sizing: border-box;
}

.result-box {
  width: 100%;
  max-width: 300px;
  border-radius: 5px;
  background-color: #fff;
  padding: 15px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s;
  border: 1px solid white;
  cursor: pointer;
}

.result-detail {
  height: 280px;
  overflow-y: auto;
  scrollbar-width: none;
  margin-bottom: 20px;
}

.result-box:hover {
  border: 1px solid var(--color-primary);
  transform: translateY(-10px);
}

.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
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

.item-more,
.item-description {
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

.item-more strong {
  color: var(--color-primary);
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
}

.item-link:hover {
  opacity: 0.8;
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
  .result-box{
    max-width: 100%;
  }
}
</style>
