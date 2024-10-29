<script setup>
import { ref, onMounted } from 'vue';
import { formatCurrency, getFeatureNames } from '@/utils/helps';
import PaymentPackagePopup from '@/components/PaymentPackagePopup.vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
const packages = ref([]);
const isPopupVisible = ref(false);
const selectedPackage = ref({});
const openPopup = (pkg) => {
    selectedPackage.value = pkg;
    isPopupVisible.value = true;
};

const closePopup = () => {
    isPopupVisible.value = false;
};
const fetchPackages = async () => {
    try {
        const response = await request.get(END_POINT.PACKAGE_LIST);
        packages.value = response.packages;
    } catch (error) {
        console.error('Lỗi lấy thông tin gói:', error);
    }
};


onMounted(() => {
    fetchPackages();
});
</script>

<template>
    <div class="main-container">

        <div class="package-page">
            <div class="header-title">
                <h1 class="title">Các gói hiện tại</h1>
                <p class="description">Khám phá các gói đăng ký và tính năng mà bạn có thể sử dụng.</p>
            </div>
            <div class="package-content">
                <div class="package-list">
                    <div v-for="pkg in packages" :key="pkg.id" class="package-card">
                        <h2 class="package-name">{{ pkg.name }}</h2>
                        <p class="package-description">{{ pkg.description }}</p>
                        <p class="package-price">Giá: {{ pkg.price === '0' ? 'Miễn phí' : formatCurrency(pkg.price) }}
                        </p>
                        <p class="package-features"
                            v-html="getFeatureNames(pkg.features) || 'Không có tính năng bổ sung'"></p>
                        <p class="package-description">Số lượt yêu cầu: {{ pkg.ask }}</p>
                        <button @click="openPopup(pkg)" class="register-btn">Đăng ký gói</button>
                    </div>
                </div>
            </div>
        </div>
        <PaymentPackagePopup :package="selectedPackage" :visible="isPopupVisible" @close="closePopup" />
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    justify-content: center;
    padding: 0 5%;
    margin: 20px 0;
}

.package-page {
    width: 100%;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    color: #333;
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
    margin-bottom: 10px;
}


.description {
    color: #555;
    font-size: 16px;
    margin-top: 10px;
}

.package-content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
}

.package-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    width: 100%;
}

.package-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    width: 100%;
    text-align: center;
    color: #333;
}

.package-name {
    font-size: 20px;
    font-weight: bold;
    color: #ff3f3f;
    margin-bottom: 10px;
}

.package-description {
    font-size: 14px;
    color: #777;
    margin-bottom: 10px;
}

.package-price {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.package-features {
    font-size: 14px;
    color: #cc4949;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.register-btn {
    background-color: #ff3f3f;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: inherit;
}

.register-btn:hover {
    background-color: #e63939;
    opacity: 0.8;
}
</style>
