<script setup>
import { ref, onMounted } from 'vue';

import { handleResponseStream, sendMessageRequest } from '@/utils/requestStream';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import useNotification from '@/composables/useNotification';

const notification = useNotification();
const isLoading = ref(false);
const selectedFile = ref(null);
const contractAssistant = ref(null);

const threadId = ref('');
const reviewResults =  ref([]);

const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
};

const startReview = async () => {
    isLoading.value = true;
    reviewResults.value = [];
    try {
        const formData = new FormData();
        formData.append("contract", selectedFile.value);

        const response = await request.post(END_POINT.SCAN_CONTRACT, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.success) {
            reviewResults.value.push( {
                role:"model",
                content:''
            });
            const message = `Đây là hợp đồng của tôi. Bạn hãy kiểm tra nội dung hợp đồng theo các mục đề xuất ở tài liệu từ đó đưa ra lời khuyên bổ sung cho hợp đồng thêm hoàn thiện. Hợp đồng là:"  ${response.dataContract} "`;
            const res = await sendMessageRequest(message, threadId.value, END_POINT);
            if (!res.ok) {
                const errorData = await res.json();
                notification.info('Thông báo!', `${errorData.message}`, {
                    showActions: true
                });
            } else {
                const newConversation = await handleResponseStream(res, reviewResults.value);
                reviewResults.value = newConversation;
                const storedConversations = JSON.parse(localStorage.getItem('reviewResults')) || [];
                storedConversations.push(newConversation);
                localStorage.setItem('reviewResults', JSON.stringify(storedConversations));
            }
        }
    } catch (error) {
        notification.error('Lỗi!', `Rà soát không thành công! Lỗi: ${error.message || error}`, {
                showActions: false
        });
    } finally {
        isLoading.value = false;
    }
};
// Tạo phiên tin nhắn mới
const fetchConversationNew = async () => {
    try {
        if (contractAssistant.value.id) {
            const response = await request.post(END_POINT.CONVERSATION_THREAD, { assistant_id: contractAssistant.value.id });
            threadId.value = response.data.id
        } else {
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};
const fetchSanContract = async () => {
    try {
        const response = await request.get(END_POINT.NAV_SCAN_CONTRACT);
        if (response.success) {
            contractAssistant.value = response.assistant;
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};
const loadConversation = async () => {
    await fetchSanContract();
    await fetchConversationNew();
};
onMounted(() => {
    loadConversation();
});
</script>
<template>
    <div class="contract-review">
        <div class="header-title">
            <h1 class="title">Rà soát hợp đồng</h1>
            <p class="subtitle">Kiểm tra và phân tích hợp đồng của bạn để đảm bảo tuân thủ và tối ưu hóa lợi ích hợp
                pháp.
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
            <button  class="review-button" :disabled="!selectedFile || isLoading"  @click="startReview">
                <span v-if="isLoading">
                    <svg style="margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                            opacity="0.5" />
                        <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                            <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                                to="360 12 12" type="rotate" />
                        </path>
                    </svg>
                    Đăng rà soát ...</span>
                <span v-else>Bắt đầu rà soát</span>
            </button>
        </div>

        <div v-if="reviewResults.length >0 " class="results-section">
            <h2>Kết quả rà soát</h2>
            <span class="copy-button" @click="copyToClipboard(message.content)">
                <i class='bx bx-copy'></i>
            </span>
            <i v-show="isLoading" class='bx bx-loader bx-spin'></i>
            <div v-for="(result, index) in reviewResults" :key="index">
                <div class="detail" :text-content="result.content" >{{ result.content }}</div>
            </div>
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
    color: var(--color-primary);
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
    border: 2px dashed var(--color-primary);
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
    background-color: var(--color-primary);
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
    opacity: 0.8;
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
    position: relative;
}
.detail {
    padding: 10px;
    margin-top: 10px;
    font-family: Arial, sans-serif;
}
.copy-button {
    cursor: pointer;
    font-size: 16px;
    margin-top: 5px;
    transition: background-color 0.3s ease;
    position: absolute;
    top: 10px;
    right: 20px;
}
</style>