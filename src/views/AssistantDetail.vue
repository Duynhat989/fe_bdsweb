<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decodeId } from '@/utils/encoding';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import useNotification from '@/composables/useNotification';
import { handleResponseStream, sendMessageRequest } from '@/utils/requestStream';
const notification = useNotification();
const route = useRoute();
const router = useRouter();

const activeTab = ref('suggest');
const encodedId = route.params.id;
const assistantId = decodeId(encodedId);
const assistantData = ref([]);
const message = ref('');
const threadId = ref('');
const conversationList = ref([]);
const suggests = ref([]);
const loading = ref(false);

const fetchAssistantData = async () => {
    try {
        if (assistantId) {
            const response = await request.post(END_POINT.ASSISTANT_FIND, { id: assistantId });
            assistantData.value = response.data;
            suggests.value = JSON.parse(response.data.suggests || '[]');
        } else {
            router.push('/404');
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};
// Tạo phiên tin nhắn mới
const fetchConversationNew = async () => {
    try {
        if (assistantId) {
            const response = await request.post(END_POINT.CONVERSATION_THREAD, { assistant_id: assistantId });
            threadId.value = response.data.id
        } else {
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        router.push('/404');
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};


const executeAction = (suggest) => {
    message.value = suggest;
    handleSend();
};
const handleSend = async () => {
    if (!message.value?.trim() || loading.value) {
        return;
    }
    loading.value = true;
    try {
        conversationList.value.push({
            role: "user",
            content: message.value
        });
        const response = await sendMessageRequest(message.value, threadId.value, END_POINT);
        if (!response.ok) {
            const errorData = await response.json();
            notification.info('Thông báo!', `${errorData.message}`, {
                showActions: true,
                onAction: ({ action }) => {
                    if (action === 'info') {
                        router.push('/package');
                    }
                }
            })
        }else {
            conversationList.value = await handleResponseStream(response, conversationList);
            message.value = "";
        }
        router.push({
            path: `/chat/${threadId.value}`
        });
    } catch (error) {
        console.error('Send request failed:', error);
    } finally {
        loading.value = false;
    }
};


const history = ref([
    { id: 1, description: 'History entry 1' },
    { id: 2, description: 'History entry 2' },
    { id: 3, description: 'History entry 3' }
]);

const loadConversation = async () => {
    if (!assistantId) {
        router.push('/404');
        return;
    }
    await fetchAssistantData();
    await fetchConversationNew();
};

onMounted(() => {
    loadConversation();

});
</script>
<template>
    <div class="main-container">
        <div class="flex">
            <div class="header-title">
                <h1 class="title">{{ assistantData.name }}</h1>
                <p>{{ assistantData.detail }}</p>
            </div>
            <div class="content-box">
                <div class="tabs">
                    <div class="tab" :class="{ active: activeTab === 'suggest' }" @click="activeTab = 'suggest'">
                        Gợi ý
                    </div>
                    <div v-if="history.length > 0" class="tab" :class="{ active: activeTab === 'history' }"
                        @click="activeTab = 'history'">
                        Lịch sử
                    </div>
                </div>
                <div class="content">
                    <div v-if="activeTab === 'suggest'" class="content-center">
                        <div class="actions">
                            <button v-for="(suggest, index) in suggests" :key="index" @click="executeAction(suggest)"
                                class="action-card">
                                <div class="icon">
                                    <i class="bx bx-message-square-dots"></i>
                                </div>
                                <div class="title">{{ suggest }}</div>
                            </button>
                        </div>
                    </div>

                    <div v-if="activeTab === 'history'" class="content-center">
                        <div class="history" v-if="history.length > 0">
                            <div class="history-item" v-for="item in history" :key="item.id" @click="openHistory(item)">
                                <div class="description">{{ item.description }}</div>
                            </div>
                        </div>
                        <span v-else>Không có lịch sử để hiển thị.</span>
                    </div>
                </div>
            </div>
            <div class="send-bar">
                <div class="send-container">
                    <div class="input-wrapper">
                        <input type="text" @keydown.enter="handleSend" v-model="message" placeholder="Nhập yêu cầu hỗ trợ..." />
                        <span class="send-icon">🔍</span>
                    </div>
                    <button class="send-button" @click="handleSend" :disabled="loading">
                        <i v-if="!loading" class='bx bx-up-arrow-circle'></i>
                        <i v-else class='bx bx-loader bx-spin'></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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

.user-message {
    background-color: #f0f0f0;
    text-align: left;
}

.model-message {
    background-color: #d0f0ff;
    text-align: right;
}

.message-item {
    margin: 8px auto;
    padding: 10px;
    border-radius: 5px;
    width: 80%;
}

.main-container {
    padding: 0 5%;
    margin: 5px auto;
    position: relative;
}

.main-container .flex {
    display: flex;
    flex-direction: column;
}

.send-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    flex-direction: column;
}

.send-container {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 8px 10px;
    border-radius: 5px;
    width: 50%;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
}

.input-wrapper input {
    width: 100%;
    padding: 10px 40px 10px 30px;
    border: none;
    margin-left: 20px;
    border-radius: 10px;
    outline: none;
    color: #2C2C2C;
    font-size: 18px;
    background-color: #f0f0f0;
    font-family: inherit;
}

.send-icon {
    position: absolute;
    left: 10px;
    font-size: 20px;
}

.send-button {
    background-color: #d9534f;
    color: #fff;
    border: none;
    padding: 8px 10px 4px 10px;
    border-radius: 5px;
    margin-left: 10px;
    font-size: 25px;
    cursor: pointer;
}

.send-button:hover {
    background-color: #c9302c;
}

.actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.action-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: calc((100% - 20px)/2);
    max-width: 250px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.action-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.action-card:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.action-card .icon {
    font-size: 24px;
    color: #666;
    margin-bottom: 8px;
}

.action-card .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.history {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.history-item {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 80%;
    margin: 0 auto;
}

.history-item:hover {
    background-color: #f1f1f1;
}

.history-item .description {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.history-item .last-message {
    font-size: 14px;
    color: #999;
}

.content-box {
    width: 100%;
    margin-top: 10px;
    position: relative;
    order: 2;
}

.tabs {
    display: flex;
    margin: 0 auto;
    width: fit-content;
    border-radius: 5px;
    overflow: hidden;
}

.tab {
    padding: 5px 20px;
    font-size: 18px;
    cursor: pointer;
    background-color: #f4f4f4;
    color: #333;
    border: none;
    text-align: center;
    width: 150px;
}

.tab.active {
    background: rgb(229, 57, 53);
    background: linear-gradient(90deg, rgba(229, 57, 53, 1) 0%, rgba(229, 57, 53, 1) 35%, rgba(44, 44, 44, 1) 100%);
    color: white;
}

.content {
    margin-top: 30px;
}

.content-center {
    width: 80%;
    margin: 0 auto;
}

/* Responsive Styles */
@media (max-width: 1200px) {
    .main-container {
        max-width: 1000px;
    }

    .send-container {
        width: 70%;
    }
}

@media (max-width: 992px) {
    .main-container {
        max-width: 800px;
    }

    .send-container {
        width: 80%;
    }

    .actions button {
        font-size: 14px;
    }

    .input-wrapper input {
        font-size: 16px;
    }
}

@media (max-width: 768px) {
    .main-container {
        max-width: 600px;
    }

    .send-container {
        width: 90%;
    }

    .actions {
        gap: 10px;
        font-size: 14px;
    }

    .header-title .title {
        font-size: 25px;
        line-height: 30px;
    }
}

@media (max-width: 576px) {
    .main-container {
        max-width: 100%;
        padding: 10px;
    }

    .send-container {
        width: 100%;
    }

    .input-wrapper input {
        font-size: 14px;
    }

    .send-button {
        font-size: 14px;
    }

    .history-item {
        width: 100%;
    }
}
</style>