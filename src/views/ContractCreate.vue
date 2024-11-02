<script setup>
import { ref, computed, onMounted } from 'vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import ContractCreatePopup from '@/components/ContractCreatePopup.vue';
const contracts = ref([]);
const showPopup = ref(false);
const selectedContract = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const total = ref(0);

const fetchContracts = async (page = currentPage.value, limit = itemsPerPage.value) => {
    try {
        const response = await request.get(END_POINT.CONTRACTS_LIST, {
            params: {
                page,
                limit
            }
        });
        contracts.value = response.contracts;
        total.value = response?.total ?? 1;
        currentPage.value = response?.page ?? 1;
        itemsPerPage.value = response?.limit ?? 10;
    } catch (error) {
        console.error('Lỗi lấy danh sách hợp đồng:', error);
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchContracts(currentPage.value, itemsPerPage.value);
    }
};
const handleClick = (contract) => {
    selectedContract.value = contract;
    showPopup.value = true;
};
const totalPages = computed(() => {
    return Math.ceil(total.value / itemsPerPage.value);
});
onMounted(() => {
    fetchContracts();
});

</script>
<template>
    <div class="create-contract">
        <div class="header-title">
            <h1 class="title">Tạo mới hợp đồng</h1>
            <p class="subtitle">Tạo hợp đồng mới theo nhu cầu của bạn với các mẫu có sẵn và tùy chỉnh dễ dàng.</p>
        </div>
        <div class="main-content">
            <div class="contract-list">
                <div class="contract-card list-card" v-for="contract in contracts" :key="contract.id"
                    @click="handleClick(contract)">
                    <img :src="contract.image" alt="contract Image" class="contract-image" />
                    <div class="contract-content">
                        <h3 class="contract-title">{{ contract.name }}</h3>
                        <p class="contract-detail">{{ contract.description }}</p>
                    </div>
                </div>
                <div class="pagination">
                    <span @click="changePage(page)" v-for="(page, index) in totalPages"
                        :class="{ active: currentPage == page }" class="page-number">
                        {{ page }}</span>
                </div>
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

.contract-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.contract-content {
    padding: 10px;
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
    text-align: justify;
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
</style>