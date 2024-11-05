<script setup>
import contract_ct from '@/assets/images/contract_ct.png';
import create_file from '@/assets/images/create_file.png';

</script>
<template>
  <div class="contract-page">
    <div class="header-title">
      <h1 class="title">Rà soát & tạo mới hợp đồng</h1>
      <p>Quản lý hợp đồng chính xác – Tiết kiệm thời gian, tối đa lợi ích</p>
    </div>
    <div class="contract-options">
      <div class="contract-box">
        <img :src="contract_ct" alt="Rà soát hợp đồng" class="contract-image" />
        <h2>Rà soát hợp đồng</h2>
        <p>Kiểm tra và phân tích hợp đồng của bạn để đảm bảo tuân thủ và tối ưu hóa lợi ích hợp pháp.</p>
        <a href="/contract/review" class="contract-button"><i class='bx bx-memory-card'></i> Rà soát ngay</a>
      </div>

      <div class="contract-box">
        <img :src="create_file" alt="Tạo hợp đồng" class="contract-image" />
        <h2>Tạo hợp đồng</h2>
        <p>Tạo mới hợp đồng theo nhu cầu của bạn với các mẫu có sẵn và tùy chỉnh dễ dàng.</p>
        <a href="/contract/create" class="contract-button"><i class='bx bxs-paint' ></i>  Tạo mới</a>
      </div>
    </div>
    <div class="contract-description">
      <h2>Giải pháp quản lý hợp đồng</h2>
      <p>
        Giải pháp quản lý hợp đồng của chúng tôi giúp bạn tiết kiệm thời gian và tối ưu hóa quy trình quản lý với sự hỗ trợ từ AI. 
        Với tính năng rà soát tự động, hệ thống sẽ phân tích các điều khoản, phát hiện những rủi ro tiềm ẩn và đề xuất chỉnh sửa hợp lý. 
        Đồng thời, bạn có thể tạo mới hợp đồng một cách nhanh chóng, sử dụng các mẫu có sẵn hoặc tùy chỉnh theo nhu cầu cụ thể.
      </p>
      <p>
        Đặc biệt, giải pháp của chúng tôi còn hỗ trợ quản lý toàn bộ vòng đời của hợp đồng, từ soạn thảo, phê duyệt, đến lưu trữ và gia hạn, 
        đảm bảo mọi hợp đồng đều được xử lý một cách hiệu quả và tuân thủ quy định pháp luật.
      </p>
    </div>
  </div>
</template>

<style scoped>
.contract-page {
  max-width: 1200px;
  padding: 50px 5%; 
  margin: 40px auto;
}

.header-title {
  text-align: center;
  margin-bottom: 40px;
}

.header-title .title {
  font-size: 40px;
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
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.contract-box p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.contract-button {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
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
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contract-description h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.contract-description p {
  font-size: 16px;
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
  .contract-page {
    width: 100%;
    padding: 20px;
  }
}
</style>
