<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { handleResponseStream, sendMessageRequest } from '@/utils/requestStream';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import useNotification from '@/composables/useNotification';
import store from '@/store';
const router = useRouter();

const notification = useNotification();
const isLoading = ref(false);
const isChatMoreLoading = ref(false);
const selectedFile = ref(null);
const contractAssistant = ref(null);
import MsgContent from '@/components/chat/MsgContent.vue';

const threadId = ref('');
const reviewResults = ref([]);

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
            reviewResults.value.push({
                role: "model",
                content: ''
            });
            const message = `Đây là hợp đồng của tôi. Bạn hãy kiểm tra nội dung hợp đồng theo các mục đề xuất ở tài liệu từ đó đưa ra lời khuyên bổ sung cho hợp đồng thêm hoàn thiện. Hợp đồng là:"  ${response.dataContract} "`;
            const res = await sendMessageRequest(message, threadId.value, END_POINT);
            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.message === 'License expired, please upgrade') {
                    notification.info('Thông báo!', 'Gói đã hết hạn, vui lòng nâng cấp!', {
                        showActions: true,
                        onAction: ({ action }) => {
                            if (action === 'info') {
                                router.push('/package');
                            }
                        }
                    });
                } else {
                    notification.info('Thông báo!', `${errorData.message}`, {
                        showActions: true,
                        onAction: ({ action }) => {
                            if (action === 'info') {
                                router.push('/package');
                            }
                        }
                    });
                }
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
const handleChatMore = async () => {
    if (!threadId.value) {
        notification.error('Lỗi!', 'Bạn chưa upload hợp đồng của bạn. Vui lòng thử lại sau.', {
            showActions: false
        });
        return;
    }
    isChatMoreLoading.value = true;
    try {
        store.commit('setAssistantName', contractAssistant.value.name);
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.href = `/chat/${threadId.value}`;
    } catch (error) {
        notification.error('Lỗi!', 'Không thể chuyển sang chat. Vui lòng thử lại!', {
            showActions: false
        });
    } finally {
        isChatMoreLoading.value = false;
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
    <div class="contract-review main-container">
        <div class="header-title">
            <h1 class="title">Rà soát hợp đồng</h1>
            <p class="subtitle" style="color: white;">Kiểm tra và phân tích hợp đồng của bạn để đảm bảo tuân thủ và tối
                ưu hóa lợi ích hợp
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
            <button class="review-button" :disabled="!selectedFile || isLoading" @click="startReview">
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
        <div v-if="reviewResults.length > 0" class="results-section">
            <div class="results-top">
                <h2>Kết quả rà soát</h2>
                <div class="chat-more-btn">
                    <button :disabled="isChatMoreLoading" @click="handleChatMore" class="chat-more-button">
                        <span v-if="isChatMoreLoading">
                            <svg style="margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" width="1em"
                                height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                    opacity="0.5" />
                                <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                                    <animateTransform attributeName="transform" dur="1s" from="0 12 12"
                                        repeatCount="indefinite" to="360 12 12" type="rotate" />
                                </path>
                            </svg>
                            Đang chuyển hướng ...
                        </span>
                        <span v-else>
                            Tiếp tục thảo luận
                        </span>
                    </button>
                </div>
            </div>
            <MsgContent v-for="(item, index) of reviewResults" :key="index" text="AI rà soát" :messA="item"
                :loading="isLoading && index === reviewResults.length - 1" />
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
    margin-top: 30px;
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

.results-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.chat-more-btn {
    text-align: center;
}

.chat-more-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.chat-more-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.chat-more-button:hover {
    background-color: #a02620;
    opacity: 0.8;
    transform: scale(1.05);
}

.chat-more-button:hover:enabled {
    background-color: #a02620;
    transform: scale(1.05);
}
</style>