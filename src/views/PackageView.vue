<script setup>
import { ref, onMounted } from 'vue';
import { formatCurrency, getFeatureNames } from '@/utils/helps';
import PaymentPackagePopup from '@/components/PaymentPackagePopup.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';

const packages = ref([]);
const isPopupVisible = ref(false);
const selectedPackage = ref({});
const isLoading = ref(false)
const license = ref({});

const openPopup = (pkg) => {

    selectedPackage.value = pkg;
    if (pkg.price !== '0') {
        isPopupVisible.value = true;
    }
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

const loadPackages = async () => {
    await fetchPackages();
    isLoading.value = true
};

onMounted(() => {
    loadPackages();
    const licenseData = localStorage.getItem('license');
    if (licenseData) {
        license.value = JSON.parse(licenseData);
    }

});
</script>

<template>
    <LoadingSpinner v-if="!isLoading" />
    <div class="main-container" v-else>
        <div class="package-page">
            <div class="header-title">
                <h1 class="title">Các gói hiện tại</h1>
                <p class="description">Khám phá các gói đăng ký và tính năng mà bạn có thể sử dụng.</p>
            </div>
            <div class="package-content">
                <div class="package-list">
                    <div v-for="pkg in packages" :key="pkg.id" class="package-card" v-show="pkg.price !== '0'">
                        <h2 class="package-name">{{ pkg.name }}</h2>
                        <p class="package-description">{{ pkg.description }}</p>
                        <p class="package-price">
                            Giá: {{ formatCurrency(pkg.price) }}
                        </p>
                        <div class="package-features feature-list"
                            v-html="getFeatureNames(pkg.features) || 'Không có tính năng bổ sung'"></div>
                        <p class="package-description">Số lượt yêu cầu: {{ pkg.ask }}</p>
                        <button @click="openPopup(pkg)" class="register-btn"
                            :disabled="license?.pack?.name === pkg.name">
                            {{ license?.pack?.name === pkg.name ? 'Đã đăng ký' : 'Nâng cấp' }}
                        </button>
                        <p v-if="license?.pack?.name === pkg.name" class="renew-message">Gia hạn thêm</p>
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
    padding: 0px 20px;
}

.package-page {
    width: 100%;
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
    color: var(--color-primary);
    line-height: 40px;
    margin-bottom: 10px;
}


.description {
    color: #ffffff;
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
    max-width: 400px;
    width: 100%;
    text-align: center;
    color: #333;
    cursor: pointer;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    position: relative;
}

.package-card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.438);
    transform: translateY(-10px);
    border: 1px solid rgb(0, 162, 255);
}

.package-name {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-primary);
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
    color: var(--color-primary);
    height: 200px;
    overflow-y: auto;
    text-overflow: ellipsis;
    text-align: left;
}


.renew-message {
    font-size: 12px;
    color: #fff;
    font-weight: 500;
    margin-top: 5px;
    position: absolute;
    top: 0px;
    right: 5px;
    border-radius: 5px;
    padding: 3px 10px;
    background-color: #b33a3a;
}

.register-btn {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: inherit;
}
.register-btn:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
}
.register-btn:hover {
    background-color: #b33a3a;
    opacity: 0.8;
}

@media (max-width: 576px) {
    .header-title {
        margin-bottom: 20px;
    }
}
</style>
<style>
.feature-list {
    margin: 20px 0;
    padding: 0;
}

.feature-list strong {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10px;
}

.feature-list ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 0;
}

.feature-list ul li {
    margin-bottom: 5px;
    font-size: 16px;
    color: #555;
    line-height: 1.5;
}

.feature-list ul li:last-child {
    margin-bottom: 0;
}
</style>