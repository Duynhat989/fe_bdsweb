<script setup>
import contract_scan from '@/assets/images/contract_scan.png';
import create_file_new from '@/assets/images/create_file_new.png';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { onMounted, ref } from 'vue';
const isLoading = ref(false);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = true; 
  }, 500); 
});
console.log(isLoading);
</script>
<template>
  <LoadingSpinner v-if="!isLoading" />
  <div class="main-container" v-else>
    <div class="header-title">
      <h1 class="title">Rà soát & tạo mới hợp đồng</h1>
      <p style="color: white;">Quản lý hợp đồng chính xác – Tiết kiệm thời gian, tối đa lợi ích</p>
    </div>
    <div class="contract-options">
      <div class="contract-box">
        <img :src="contract_scan" alt="Rà soát hợp đồng" class="contract-image" />
        <h2>Rà soát hợp đồng</h2>
        <p>Kiểm tra và phân tích hợp đồng của bạn để đảm bảo tuân thủ và tối ưu hóa lợi ích hợp pháp.</p>
        <a href="/contract/review" class="contract-button"><i class='bx bx-memory-card'></i> Rà soát ngay</a>
      </div>

      <div class="contract-box">
        <img :src="create_file_new" alt="Tạo hợp đồng" class="contract-image" />
        <h2>Tạo hợp đồng</h2>
        <p>Tạo mới hợp đồng theo nhu cầu của bạn với các mẫu có sẵn và tùy chỉnh dễ dàng.</p>
        <a href="/contract/create" class="contract-button"><i class='bx bxs-paint' ></i>  Tạo mới</a>
      </div>
    </div>
    <div class="contract-description">
      <h2>Giải pháp quản lý hợp đồng</h2>
      <p>
        Giải pháp quản lý hợp đồng của chúng tôi giúp bạn tiết kiệm thời gian và tối ưu hóa quy trình quản lý với sự hỗ trợ từ AI. Với tính năng rà soát tự động, hệ thống sẽ phân tích các điều khoản, phát hiện những rủi ro tiềm ẩn và đề xuất chỉnh sửa hợp lý. Đồng thời, bạn có thể tạo mới hợp đồng một cách nhanh chóng, sử dụng các mẫu có sẵn hoặc tùy chỉnh theo nhu cầu cụ thể.
      </p>
      <div class="note">
        Đây là giải pháp tham khảo nhằm mục đích tối ưu quá trình rà soát và tạo hợp đồng 1 cách nhanh nhất. Vui lòng chỉ sử dụng để tham khảo, chúng tôi không chịu trách nhiệm nếu bạn sử dụng trực tiếp hợp đồng này.
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 1200px;
  padding: 0px 5%; 
  margin: 40px auto;
}

.header-title {
  text-align: center;
  margin-bottom: 40px;
  /* margin-top: 40px; */
}

.header-title .title {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-primary);
  line-height: 40px;
}

.header-title p {
  font-size: 16px;
  margin-top: 8px;
}

.contract-options {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.contract-box {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 45%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.contract-box:hover {
  transform: translateY(-5px);
}

.contract-image {
  width: 210px;
  height: auto;
  border-radius: 8px;
  margin: 10px auto;
}

.contract-box h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 5px;
}

.contract-box p {
  font-size: 15px;
  color: #666;
  margin-bottom: 10px;
}

.contract-button {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.contract-button:hover {
  background-color: #c03228;
}

.contract-description {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.contract-description h2 {
  font-size: 23px;
  color:  var(--color-primary);
  margin-bottom: 20px;
}
.note {
  position: relative;
  margin-bottom: 0px;
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #c03228;
}

.contract-description p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .contract-box {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .main-container {
    width: 100%;
    padding: 20px;
  }
}
</style>
