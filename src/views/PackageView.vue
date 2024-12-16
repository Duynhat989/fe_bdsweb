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

// const fetchLicense = async () => {
//   try {
//     const response = await request.get(END_POINT.LICENSE_GET);
//     license.value = response.license;
//     console.log(license.value);
//   } catch (error) {
//     console.error('Lỗi lấy thông tin gói:', error);
//     notification.error('Lỗi!', 'Không thể lấy thông tin gói. Vui lòng thử lại!', {
//       showActions: false,
//     });
//   }
// };
const openPopup = (pkg) => {
    
    selectedPackage.value = pkg;
    if(pkg.price !== '0') {
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
    console.log(license.value.pack.name);
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
                    <div v-for="pkg in packages" :key="pkg.id" class="package-card" v-show="pkg.price !== '0'" >
                        <h2 class="package-name">{{ pkg.name }}</h2>
                        <p class="package-description">{{ pkg.description }}</p>
                        <p class="package-price">
                            Giá: {{ formatCurrency(pkg.price) }}
                        </p>
                        <p class="package-features"
                            v-html="getFeatureNames(pkg.features) || 'Không có tính năng bổ sung'"></p>
                        <p class="package-description">Số lượt yêu cầu: {{ pkg.ask }}</p>
                        <button @click="openPopup(pkg)"  class="register-btn">Nâng cấp</button>
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
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
