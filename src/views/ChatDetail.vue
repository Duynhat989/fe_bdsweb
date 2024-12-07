<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { handleResponseStream, sendMessageRequest } from '@/utils/requestStream';
import useNotification from '@/composables/useNotification';
import store from '@/store';
import MsgContent from '@/components/chat/MsgContent.vue';
const notification = useNotification();
const route = useRoute();
const router = useRouter();
const conversationList = ref([]);
const loading = ref(false);
const conversationContainer = ref(null);
const message = ref('');
const messageOld = computed(() => store.state.message);
const assistantName = computed(() => store.state.assistantName);

const threadId = computed(() => route.params.id);
const goBack = () => router.back();


const scrollToBottom = () => {
    nextTick(() => {
        if (conversationContainer.value) {
            conversationContainer.value.scrollTop = conversationContainer.value.scrollHeight;
        }
    });
};

// Danh sách tin nhắn
const fetchConversationList = async () => {
    try {
        if (threadId) {
            const response = await request.post(END_POINT.CONVERSATION_LIST, { thread_id: threadId.value });
            conversationList.value = response.data.messages;
        }
    } catch (error) {
        notification.error('Lỗi!', `Lỗi khi tải dữ liệu`, {
            showActions: false
        })
    }
};

const handleSend = async () => {
    if (!message.value?.trim() || loading.value) {
        return;
    }
    loading.value = true;
    conversationList.value.push({
            role: "user",
            content: message.value
        });
        conversationList.value.push( {
            role:"model",
            content:'',
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
        } else {
            conversationList.value = await handleResponseStream(response, conversationList.value);
            store.commit('setMessage', "");
            message.value = "";
            console.log(conversationList.value);
        }
    try {
        
    } catch (error) {
        notification.error('Lỗi!', `Lỗi khi tải gửi tin! Lỗi ${error}`, {
            showActions: false
        })
    } finally {
        loading.value = false;
    }
};
const loadConversation = async () => {
    await fetchConversationList();
    if (messageOld.value?.trim()) {
        message.value = messageOld.value;
        await handleSend();
    }
};

onMounted(() => {
    loadConversation();
});

watch(conversationList, () => {
    scrollToBottom();
}, { deep: true });

</script>
<template>
    <div class="main-container">
        <div class="flex">
            <button class="back-button" @click="goBack"><i class='bx bx-arrow-back'></i> Back</button>
            <div class="header-title">
                <h1 class="title">{{ assistantName ? assistantName : 'Rà soát hợp đồng' }}</h1>
            </div>
            <div v-if="conversationList && conversationList.length > 0" ref="conversationContainer"
                class="conversation-list">
                <MsgContent v-for="(item, index) of conversationList" :key="index"  :messA="item"   :loading="loading && index === conversationList.length - 1" />
            </div>
            <div class="send-bar">
                <div class="send-container">
                    <div class="input-wrapper">
                        <input :disabled="loading" type="text" v-model="message" @keydown.enter="handleSend"
                            placeholder="Nhập yêu cầu hỗ trợ..." />
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
.back-button {
    position: absolute;
    top: 20px;
    left: 70px;
    background-color: #fff;
    border: 1px solid var(--color-primary);
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    color: var(--color-primary);
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: var(--color-primary);
    color: #fff;
}

.header-title {
    text-align: center;
    margin-top: 40px;
}

.header-title .title {
    font-size: 30px;
    font-weight: bold;
    color: #e03d31;
    line-height: 40px;
    margin-bottom: 10px;
}

.user-message {
    background-color: #fff;
    text-align: right;
}

.model-message {
    background-color: #f0f0f0;
    text-align: left;
}

.message-item {
    margin: 8px auto;
    padding: 10px 15px;
    border-radius: 10px;
    width: 80%;
    position: relative;
    font-size: 15px;
    line-height: 21px;
}

.message-item .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.message-item span.avatar {
    background: var(--color-primary);
    text-align: center;
    justify-content: center;
    line-height: 50px;
    color: #fff;
    font-weight: 700;
    font-size: 20px;
    display: flex;
    align-items: center;
}

.message-content {
    font-size: 15px;
    line-height: 21px;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    transition: opacity 0.2s ease-in-out;
    white-space: pre-wrap;
    opacity: 1;
}
.copy-button {
    cursor: pointer;
    font-size: 16px;
    margin-top: 5px;
    transition: background-color 0.3s ease;
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
    width:70%;
    max-width: 800px;
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
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    padding: 8px 10px 4px 10px;
    border-radius: 5px;
    margin-left: 10px;
    font-size: 25px;
    cursor: pointer;
}

.send-button:hover {
    opacity: 0.7;
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
    font-size: 13px;
    color: #333;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: calc((100% - 20px)/2);
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
    font-size: 13px;
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

.conversation-list {
    padding-top: 30px;
    max-height: calc(85vh - 100px);
    overflow: auto;
    transition: all 1s;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.user-message .avatar {
    right: -60px;
}

.model-message .avatar {
    left: -60px;
}

.content-box {
    width: 100%;
    padding: 20px;
    margin-top: 20px;
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
    background: var(--color-primary);
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) 35%, rgba(44, 44, 44, 1) 100%);
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
    .conversation-list {
        width: 100%;
        margin: 0 auto;
    }
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
    .message-item .avatar {
        width: 35px;
        height: 35px;
        position: absolute;
    }
    .user-message .avatar {
        right: -40px;
    }

    .model-message .avatar {
        left: -40px;
    }

}

@media (max-width: 576px) {
    .back-button {
        right: 6px;
        left: auto;
        top: 6px;
    }

    .main-container {
        max-width: 100%;
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
 
    .message-item {
        width: 100%;
        position: relative;
    }
    .user-message .copy-button {
        display: flex;
        justify-content: start;
    }
    .model-message .copy-button{
        display: flex;
        justify-content: flex-end;
    }
    .user-message .avatar {
        right: 0px;
        top: 10px;
    }
    .model-message .avatar {
        left: 0px;
        top: 10px;
    }
}
</style>