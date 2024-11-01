<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decodeId } from '@/utils/encoding';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import useNotification from '@/composables/useNotification';
import { handleResponseStream, sendMessageRequest } from '@/utils/requestStream';
import AddPromptPopup from '@/components/AddPromptPopup.vue';
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
const historys = ref([]);
const loading = ref(false);
const messageInput = ref(null);
const currentHistoryPage = ref(1);
const currentPromptPage = ref(1);
const itemsPromptPage = ref(10);
const itemsHistoryPage = ref(10);

const totalHistory = ref(0);
const totalPrompts = ref(0);
const prompts = ref([]);

const showPopup = ref(false);

const addPrompt = () => {
    showPopup.value = true;
};
const addPromptToList = (newPrompt) => {
    prompts.value.push(newPrompt.value);
};
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
const fetchHistorys = async (page = currentHistoryPage.value, limit = itemsHistoryPage.value) => {
    try {
        if (assistantId) {
            const response = await request.post(`${END_POINT.HISTORYS_LIST}?page=${parseInt(page, 10)}&limit=${parseInt(limit, 10)}`, {
                assistant_id: assistantId,
            });
            historys.value = response.data
            totalHistory.value = response.total;
            currentHistoryPage.value = response.page;
            itemsHistoryPage.value = response.limit;
        } else {
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        router.push('/404');
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};
const fetchPrompts = async (page = currentPromptPage.value, limit = itemsPromptPage.value) => {
    try {
        if (assistantId) {
            const response = await request.post(END_POINT.PROMPTS_LIST, {
                assistant_id: assistantId,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            });
            prompts.value = response.prompts
            totalPrompts.value = response.total;
            currentPromptPage.value = response.page;
            itemsPromptPage.value = response.limit;
        } else {
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        router.push('/404');
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};

const totalHistoryPages = computed(() => Math.ceil(totalHistory.value / itemsHistoryPage.value));
const totalPromptPages = computed(() => Math.ceil(totalPrompts.value / itemsPromptPage.value));


const changeHistoryPage = (page) => {
    if (page >= 1 && page <= totalHistoryPages.value) {
        currentHistoryPage.value = page;
        fetchHistorys(currentHistoryPage.value, itemsHistoryPage.value);
    }
};

const changePromptPage = (page) => {
    if (page >= 1 && page <= totalPromptPages.value) {
        currentPromptPage.value = page;
        fetchPrompts(currentPromptPage.value, itemsPromptPage.value);
    }
};

const executeAction = (suggest) => {
    message.value = suggest;
    handleSend();
};
const executePrompt = (suggest) => {
    message.value = suggest.prompt_text;
    messageInput.value.focus();
};
const deletePrompt = async (id) => {
    let data = JSON.stringify({
        "id": id
    });
    const confirmDelete = confirm("Bạn có chắc muốn xóa prompt này không?");
    if (confirmDelete) {
        try {
            const response = await request.delete(END_POINT.PROMPT_DELETE, { data: data });
            const index = prompts.value.findIndex(a => a.id === id);
            if (index !== -1) {
                prompts.value.splice(index, 1,);
            }
            if (response.success) {
                notification.success('Thành công!', 'Xóa prompt thành công!', {
                    showActions: false
                });
            } else {
                notification.error('Lỗi!', `Xóa prompt không thành công!`, {
                    showActions: false
                });
            }
        } catch (error) {
            notification.error('Lỗi!', `Xóa prompt không thành công! Lỗi: ${error.message || error}`, {
                showActions: false
            });
        }
    }
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
        await fetchConversationNew();
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

const openHistory = (thread_id) => {
    const threadId = thread_id.replace('thread_', '');
    router.push({
        path: `/chat/${threadId}`
    });
};
const loadConversation = async () => {
    if (!assistantId) {
        router.push('/404');
        return;
    }
    await fetchAssistantData();
    await fetchPrompts();
    await fetchHistorys();
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
                    <div v-if="historys.length > 0" class="tab" :class="{ active: activeTab === 'history' }"
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
                        <div class="prompts">
                            <div class="prompt-controls">
                                <button @click="addPrompt" class="add-btn">Thêm Prompt</button>
                            </div>
                            <button v-for="(prompt, index) in prompts" :key="prompt.id" @click="executePrompt(prompt)"
                                class="prompt-card">
                                <div class="prompt-icon">
                                    <i class="bx bx-credit-card-front"></i>
                                </div>
                                <div class="prompt-content">
                                    <div class="prompt-title">{{ prompt.prompt_text }}</div>
                                    <button @click.stop="deletePrompt(prompt.id)" class="delete-btn">Xóa</button>
                                </div>
                            </button>
                            <div class="pagination">
                                <span v-for="page in totalPromptPages" :key="page" @click="changePromptPage(page)"
                                    :class="{ active: currentPromptPage == page }" class="page-number">
                                    {{ page }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'history'" class="content-center">
                        <div class="history" v-if="historys.length > 0">
                            <div class="history-item" v-for="item in historys" :key="item.id"
                                @click="openHistory(item.thread_idid)">
                                {{ item.name }}
                            </div>
                        </div>
                        <div class="pagination">
                            <span v-for="page in totalHistoryPages " :key="page" @click="changeHistoryPage(page)"
                                :class="{ active: currentHistoryPage == page }" class="page-number">
                                {{ page }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="send-bar">
                <div class="send-container">
                    <div class="input-wrapper">
                        <input type="text" @keydown.enter="handleSend" v-model="message"
                            placeholder="Nhập yêu cầu hỗ trợ..." ref="messageInput" />
                        <span class="send-icon">🔍</span>
                    </div>
                    <button class="send-button" @click="handleSend" :disabled="loading">
                        <i v-if="!loading" class='bx bx-up-arrow-circle'></i>
                        <i v-else class='bx bx-loader bx-spin'></i>
                    </button>
                </div>
            </div>
        </div>
        <AddPromptPopup v-if="showPopup" :assistantId="assistantId" :visible="showPopup" @close="showPopup = false"
            @promptAdded="addPromptToList" />
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

.prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 30px;
    padding: 55px 20px 20px 20px;
    border-radius: 15px;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.prompt-controls {
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 10px;
    top: 10px;
}

.add-btn {
    background-color: #E03C31;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.add-btn:hover {
    opacity: 0.8;
}

.prompt-card {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    width: calc((100% - 30px)/4);

    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.prompt-card:hover {
    background-color: #e9ecef;
}

.promt-icon {
    margin-right: 10px;
    font-size: 24px;
    color: #007bff;
}

.prompt-content {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.prompt-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.delete-btn {
    align-self: flex-end;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.delete-btn:hover {
    background-color: #ff7875;
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
    color: #c9302c;
}

.prompts .pagination {
    text-align: left;
}

.pagination {
    width: 100%;
    margin-top: 20px;
    text-align: center;
}

.pagination span {
    padding: 10px 15px;
    background-color: #ccc;
    color: #111;
    margin: 0px 5px;
    cursor: pointer;
}

.pagination span.active,
.pagination span:hover {
    background-color: #e03d31;

    color: #fff;
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
    .content-center {
        width: 90%;
    }

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

    .prompt-card {
        width: calc((100% - 20px) / 3);
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

    .prompt-card {
        width: calc((100% - 10px) / 2);
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

    .prompt-card {
        width: 100%;
    }
}
</style>