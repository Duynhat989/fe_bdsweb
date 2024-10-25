
<script setup>
import { ref, computed, watch } from 'vue';
import { encodeId } from '@/utils/encoding';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDetail = (id) => {
  const encodedId = encodeId(id);
  router.push(`/project-detail/${encodedId}`);
};

const filters = ref([
  { name: 'category', label: 'Danh mục', options: ['Biệt thự', 'Căn hộ', 'Đất nền'] },
  { name: 'groupType', label: 'Nhóm loại', options: ['Loại A', 'Loại B', 'Loại C'] },
  { name: 'locationType', label: 'Nội quy ngoại', options: ['Trong nước', 'Nước ngoài'] },
  { name: 'landType', label: 'Mẫu đất', options: ['Đất thổ cư', 'Đất nông nghiệp'] },
  { name: 'propertyType', label: 'Loại hình', options: ['Nhà ở', 'Kinh doanh'] },
  { name: 'attribute', label: 'Thuộc tính', options: ['Có sổ đỏ', 'Gần trung tâm', 'Gần trường học'] },
]);

const selectedFilters = ref({
  category: '',
  groupType: '',
  locationType: '',
  landType: '',
  propertyType: '',
  attribute: '',
});

const items = ref([
  {
    id: 1,
    name: 'Biệt thự sang trọng',
    image: 'https://hocvienamg.edu.vn/wp-content/uploads/2023/07/nguoi-dan-duong-bds.jpg',
    location: 'Quận 1, TP.HCM',
    description: 'Biệt thự với thiết kế hiện đại, đầy đủ tiện nghi, gần trung tâm thành phố.',
    category: 'Biệt thự',
    groupType: 'Loại A',
    locationType: 'Trong nước',
    landType: 'Đất thổ cư',
    propertyType: 'Nhà ở',
    attribute: 'Có sổ đỏ',
  },
  {
    id: 2,
    name: 'Căn hộ cao cấp',
    image: 'https://hocvienamg.edu.vn/wp-content/uploads/2023/07/nguoi-dan-duong-bds.jpg',
    location: 'Quận 7, TP.HCM',
    description: 'Căn hộ nằm trong khu vực yên tĩnh, nhiều tiện ích xung quanh.',
    category: 'Căn hộ',
    groupType: 'Loại B',
    locationType: 'Trong nước',
    landType: 'Đất thổ cư',
    propertyType: 'Nhà ở',
    attribute: 'Gần trường học',
  },
]);

const filteredItems = computed(() => {
  return items.value.filter(item => {
    return Object.keys(selectedFilters.value).every(filterKey => {
      const filterValue = selectedFilters.value[filterKey];
      return !filterValue || item[filterKey] === filterValue;
    });
  });
});

const applyFilters = () => {
  console.log('Danh sách filters', selectedFilters.value);
};

watch(selectedFilters, applyFilters);

</script>

<template>
  <div class="real-estate-search">
    <div class="header">
      <div class="header-title">
        <h1 class="title">Tìm kiếm bất động sản</h1>
        <p>Khám phá các lựa chọn bất động sản phù hợp với nhu cầu của bạn.</p>
      </div>
      <div class="filters">
        <div class="filter-item" v-for="filter in filters" :key="filter.name">
          <label :for="filter.name">{{ filter.label }}</label>
          <select :id="filter.name" v-model="selectedFilters[filter.name]" @change="applyFilters">
            <option value="">Tất cả</option>
            <option v-for="option in filter.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <button class="filter-apply" @click="applyFilters">LỌC</button>
      </div>
    </div>
    <div class="results">
      <div class="result-box" v-for="item in filteredItems" :key="item.id"  @click="goToDetail(item.id)">
        <img :src="item.image" alt="Property Image" class="item-image" />
        <h3 class="item-name">{{ item.name }}</h3>
        <p class="item-location">{{ item.location }}</p>
        <p class="item-description">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.real-estate-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 40px;
  margin-top: 40px;
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
  color: #c03228;
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
  background-color: #c03228;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.result-box {
  border-radius: 5px;
  background-color: #fff;
  padding: 15px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.result-box:hover {
  border: 1px solid #c03228;
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

.item-description {
  font-size: 14px;
  color: #555;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .results {
    grid-template-columns: repeat(3, 1fr);
  }
  .filters {
    gap: 10px;
    margin: 10px 0;
  }
}

@media (max-width: 768px) {
  .results {
    grid-template-columns: repeat(2, 1fr);
  }
  .filters {
    gap: 10px;
    margin: 10px 0;
    justify-content: flex-start;
  }

}

@media (max-width: 576px) {
  .results {
    grid-template-columns: 1fr;
  }
}
</style>
