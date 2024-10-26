
<script setup>
import { ref } from 'vue';

const selectedFile = ref(null);
const reviewResults = ref(null);

const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
};

const startReview = () => {
    // call api
    setTimeout(() => {
        reviewResults.value = {
            status: 'Đã hoàn tất rà soát',
            issues: [
                { id: 1, description: 'Điều khoản 1 chưa rõ ràng về quyền và nghĩa vụ' },
                { id: 2, description: 'Điều khoản 3 có thể gây tranh chấp trong thực tế' },
            ],
        };
    }, 2000);
};

const resolveIssues = () => {
    alert('Chuyển đến trang giải quyết các vấn đề.');
};
</script>
<template>
    <div class="contract-review">
        <div class="header-title">
            <h1 class="title">Rà soát hợp đồng</h1>
            <p class="subtitle">Kiểm tra và phân tích hợp đồng của bạn để đảm bảo tuân thủ và tối ưu hóa lợi ích hợp pháp.
            </p>
        </div>
        <div class="upload-section">
            <h2>Upload hợp đồng của bạn</h2>
            <div class="custom-file-upload">
                <label for="file-upload" class="upload-label">
                    <i class='bx bx-memory-card'></i> &nbsp; &nbsp;
                    <span>{{ selectedFile ? selectedFile.name : "Chọn tệp hợp đồng" }}</span>
                </label>
                <input id="file-upload" type="file" @change="handleFileUpload" />
            </div>
            <button @click="startReview" :disabled="!selectedFile" class="review-button">Bắt đầu rà soát</button>
        </div>

        <div v-if="reviewResults" class="results-section">
            <h2>Kết quả rà soát</h2>
            <p>Tên hợp đồng: Hợp đồng bất động sản</p>
            <p><strong>Trạng thái:</strong> {{ reviewResults.status }}</p>
            <p><strong>Những điều khoản có vấn đề:</strong></p>
            <ul>
                <li v-for="issue in reviewResults.issues" :key="issue.id">
                    {{ issue.description }}
                </li>
            </ul>
            <button class="resolve-button" @click="resolveIssues">Giải quyết các vấn đề</button>
        </div>
    </div>
</template>

<style scoped>
.contract-review {
    max-width: 1200px;
    padding: 0 5%;
    margin: 0 auto;
    text-align: center;
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

.upload-section {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

.upload-section h2 {
    margin: 10px 0px;
    font-weight: bold;
    font-size: 18px;
}

.custom-file-upload {
    margin-bottom: 20px;
    position: relative;
}

.upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e8f0fe;
    border: 2px dashed #c03228;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    color: #333;
    font-size: 16px;
    width: 50%;
    margin: 0 auto;
}

.upload-label svg {
    margin-right: 8px;
}

.upload-label:hover {
    background-color: #d1e7ff;
}

.custom-file-upload input {
    display: none;
}

.review-button {
    background-color: #c03228;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.review-button:hover {
    background-color: #a02620;
}

.review-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.results-section {
  background: #e8f0fe;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.results-section h2 {
  font-size: 24px;
  color: #c03228;
  margin-bottom: 15px;
}

.results-section p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}
.results-section ul {
  list-style: none; 
  padding-left: 0;
}

.results-section li {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.results-section li:hover {
  background-color: #f5f5f5;
}

.results-section li:before {
  content: '⚠️'; 
  margin-right: 8px;
  font-size: 18px;
}
.resolve-button {
    background-color: #c03228;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}
</style>