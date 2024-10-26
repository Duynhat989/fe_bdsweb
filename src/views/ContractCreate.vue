<script setup>
import { ref, computed } from 'vue';
// const contracts = ref([]);
const contracts = ref([
    {
        id: 1,
        name: "Hợp Đồng Dịch Vụ",
        detail: "Hợp đồng dịch vụ với các điều khoản chi tiết về cung cấp dịch vụ.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Dịch+Vụ",
        view: 120,
    },
    {
        id: 2,
        name: "Hợp Đồng Lao Động",
        detail: "Hợp đồng lao động cho nhân viên toàn thời gian.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Lao+Động",
        view: 90,
    },
    {
        id: 3,
        name: "Hợp Đồng Thuê Nhà",
        detail: "Hợp đồng thuê nhà bao gồm các điều khoản về thanh toán và bảo trì.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Thuê+Nhà",
        view: 150,
    },
    {
        id: 4,
        name: "Hợp Đồng Bán Hàng",
        detail: "Hợp đồng bán hàng với chi tiết về sản phẩm và điều kiện thanh toán.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Bán+Hàng",
        view: 200,
    },
    {
        id: 5,
        name: "Hợp Đồng Đối Tác",
        detail: "Hợp đồng hợp tác giữa các bên với các điều khoản rõ ràng.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Đối+Tác",
        view: 80,
    },
    {
        id: 6,
        name: "Hợp Đồng Chuyển Nhượng",
        detail: "Hợp đồng chuyển nhượng quyền sở hữu tài sản.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Chuyển+Nhượng",
        view: 110,
    },
    {
        id: 7,
        name: "Hợp Đồng Cho Thuê Thiết Bị",
        detail: "Hợp đồng cho thuê thiết bị văn phòng và máy móc.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Cho+Thuê+Thiết+Bị",
        view: 130,
    },
    {
        id: 8,
        name: "Hợp Đồng Dự Án",
        detail: "Hợp đồng dự án xây dựng với các điều khoản chi tiết.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Dự+Án",
        view: 175,
    },
    {
        id: 9,
        name: "Hợp Đồng Tư Vấn",
        detail: "Hợp đồng tư vấn với các điều khoản dịch vụ chuyên nghiệp.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Tư+Vấn",
        view: 95,
    },
    {
        id: 10,
        name: "Hợp Đồng Đầu Tư",
        detail: "Hợp đồng đầu tư với các điều khoản và điều kiện cụ thể.",
        image: "https://via.placeholder.com/300x180.png?text=Hợp+Đồng+Đầu+Tư",
        view: 140,
    },
]);
const currentPage = ref(1);
const itemsPerPage = ref(8);
// call api
const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return contracts.value.slice(start, end);
});
const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
const handleClick = (id) => {
    //   const encodedId = encodeId(id);
    //   router.push(`/contract/${encodedId}`);
};
const totalPages = computed(() => {
    return Math.ceil(contracts.value.length / itemsPerPage.value);
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
                <div class="contract-card list-card" v-for="contract in paginatedItems" :key="contract.id"
                    @click="handleClick(contract.id)">
                    <img :src="contract.image" alt="contract Image" class="contract-image" />
                    <div class="contract-content">
                        <h3 class="contract-title">{{ contract.name }}</h3>
                        <p class="contract-detail">{{ contract.detail }}</p>
                        <span class="contract-view">Lượt xem: {{ contract.view }}</span>
                    </div>
                </div>
                <div class="pagination">
                    <span @click="changePage(page)" v-for="(page, index) in totalPages"
                        :class="{ active: currentPage === page }" class="page-number">
                        {{ page }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.create-contract {
    margin: 0 auto;
    text-align: center;
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
    color: #e03d31;
    line-height: 40px;
}

.header-title .subtitle {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
}

.contract-list {
    display: flex;
    margin: 30px auto;
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

.contract-view {
    font-size: 12px;
    color: #777;
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

</style>