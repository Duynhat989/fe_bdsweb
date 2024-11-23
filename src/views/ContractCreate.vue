<script setup>
import { ref, onMounted , watch } from 'vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import ContractCreatePopup from '@/components/ContractCreatePopup.vue';
import Pagination from '@/components/Pagination.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const contracts = ref([]);
const showPopup = ref(false);
const selectedContract = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const total = ref(0);
const searchQuery = ref('');
const isLoading = ref(false)
const fetchContracts = async (page = currentPage.value, limit = itemsPerPage.value, search = searchQuery.value) => {
    const response = await request.get(END_POINT.CONTRACTS_LIST, {
            params: {
                page,
                limit,
                search
            }
        });
        contracts.value = response.contracts;
        total.value = response?.total ?? 1;
        currentPage.value = response?.page ?? 1;
        itemsPerPage.value = response?.limit ?? 10;
    try {
        
    } catch (error) {
        console.error('Lỗi lấy danh sách hợp đồng:', error);
    }
};


const handleClick = (contract) => {
    selectedContract.value = contract;
    showPopup.value = true;
};
let timeout;
watch(
  searchQuery,
  (newQuery) => {
    isLoading.value = false
    try { clearTimeout(timeout) } catch (error) { }
    timeout = setTimeout(() => {
      if (newQuery) {
        fetchContracts(currentPage.value, itemsPerPage.value, newQuery);
      } else {
        fetchContracts();
      }
      isLoading.value = true
    }, 1000)
  }
);
const changePage = (page) => {
  currentPage.value = page;
  if (searchQuery.value) {
      fetchContracts(currentPage.value, itemsPerPage.value, searchQuery.value);
    } else {
        fetchContracts(currentPage.value, itemsPerPage.value);
  }
};
const loadContracts = async () => {
  await fetchContracts();
  isLoading.value = true
};

onMounted(() => {
    loadContracts();
});

</script>
<template>
    <div class="create-contract">
        <div class="header">
            <div class="header-title">
                <h1 class="title">Tạo mới hợp đồng</h1>
                <p class="subtitle" style="color: white;">Tạo hợp đồng mới theo nhu cầu của bạn với các mẫu có sẵn và tùy chỉnh dễ dàng.</p>
            </div>
            <div class="search-bar">
                <i class='bx bx-search-alt-2 search-icon'></i>
                <input type="text" v-model="searchQuery" placeholder="Nhập từ khóa tìm kiếm..." class="search-input" />
            </div>
        </div>
        <p style="color: white; text-align: center;">Lưu ý: <i style="font-size: 12px;color: red;">Đây là giải pháp tham khảo nhằm mục đích tối ưu quá trình tạo hợp đồng 1 cách nhanh nhất. Vui lòng chỉ sử dụng để tham khảo, chúng tôi không chịu trách nhiệm nếu bạn sử dụng trực tiếp với mục đích thương mại.</i></p>
        <div class="main-content"  >
            <LoadingSpinner v-if="!isLoading" />
            <div class="contract-list"  v-else>
                <div class="contract-card list-card" v-for="contract in contracts" :key="contract.id"
                    @click="handleClick(contract)">
                    <img :src="contract.image" alt="contract Image" class="contract-image" />
                    <div class="contract-content">
                        <h3 class="contract-title">{{ contract.name }}</h3>
                        <p class="contract-detail">{{ contract.description }}</p>
                    </div>
                </div>
                <Pagination
                    :total="total"
                    :itemsPerPage="itemsPerPage"
                    :currentPage="currentPage"
                    @changePage="changePage"
                />
            </div>
            <div class="note" v-if="contracts.length == 0">
                Không tìm thấy kết quả
            </div>
        </div>
        
        <ContractCreatePopup v-if="showPopup" :contract="selectedContract" :visible="showPopup"
            @close="showPopup = false" />

    </div>
</template>

<style scoped>
.create-contract {
    margin: 5px auto;
    padding: 0 5%;
}

.header {
  margin-bottom: 40px;
  margin-top: 40px;
}

.search-bar {
    position: relative;
    max-width: 50%;
    margin: 0 auto;
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
.search-input:focus {
    border-color: #4a90e2;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
    color: #aaa;
    font-size: 14px;
}
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

.header-title .subtitle {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
}

.contract-list {
    display: flex;
    margin: 30px 0;
    flex-wrap: wrap;
    gap: 15px;
}


.contract-card:hover {
    transform: scale(1.02);
}

.contract-card {
    background: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s ease;
    display: flex;
    padding: 10px;
    align-items: center;
    flex-direction: column;
    width: calc((100% - 45px) / 4);
}

.contract-card:hover {
    transform: scale(1.05);
}
.isloading {
    height: 50vh;
    background-color: transparent;
}
.main-content .note {
    text-align: center;
    color: white;
}
.contract-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.contract-content {
    padding: 10px;
    width: 100%;
}

.contract-title {
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
    text-align: center;
}

.contract-detail {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (min-width: 1024px) {
    .contract-card {
        width: calc((100% - 45px) / 4);
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .contract-card {
        width: calc((100% - 30px) / 3);
    }
}

@media (max-width: 767px) {
    .contract-card {
        width: calc((100% - 15px) / 2);
    }
}

@media (max-width: 480px) {
    .contract-card {
        width: 100%; 
    }
}
</style>