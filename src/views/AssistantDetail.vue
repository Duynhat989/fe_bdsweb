<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decodeId } from '@/utils/encoding';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import useNotification from '@/composables/useNotification';
import AddPromptPopup from '@/components/AddPromptPopup.vue';
import store from '@/store';
import icon_logo from '@/assets/images/promt.jpg';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import Pagination from '@/components/Pagination.vue';
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
const itemsPromptPage = ref(8);
const itemsHistoryPage = ref(10);

const totalHistory = ref(0);
const totalPrompts = ref(0);
const prompts = ref([]);

const showPopup = ref(false);
const isEdit = ref(false);
const selectePrompt = ref(null)

const isLoading = ref(false)

const goBack = () => router.back();

const addPrompt = () => {
    showPopup.value = true;
    isEdit.value = false;
    selectePrompt.value = null;
};
const editPrompt = async (prompt) => {
    showPopup.value = true;
    selectePrompt.value = prompt;
    isEdit.value = true
};
const addPromptToList = ({ prompt, isEdit }) => {
    if (isEdit) {
        const index = prompts.value.findIndex(p => p.id === prompt.id);
        if (index !== -1) {
            prompts.value.splice(index, 1, prompt);
        }
    } else {
        prompts.value.push(prompt);
    }
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
            // const response = await request.post(`${END_POINT.PROMPTS_LIST}?page=${parseInt(page, 10)}&limit=${parseInt(limit, 10)}`, {
            //     assistant_id: assistantId,
            // });
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

// const totalHistoryPages = computed(() => Math.ceil(totalHistory.value / itemsHistoryPage.value));
// const totalPromptPages = computed(() => Math.ceil(totalPrompts.value / itemsPromptPage.value));


const changeHistoryPage = (page) => {
    currentHistoryPage.value = page;
    fetchHistorys(currentHistoryPage.value, itemsHistoryPage.value);
};

const changePromptPage = (page) => {
    currentPromptPage.value = page;
    fetchPrompts(currentPromptPage.value, itemsPromptPage.value);
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
        await fetchConversationNew()
        store.commit('setMessage', message.value);
        store.commit('setAssistantName', assistantData.value.name);
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
    store.commit('setAssistantName', assistantData.value.name);
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
    isLoading.value = true
};

onMounted(() => {
    loadConversation();
});
</script>
<template>
    <LoadingSpinner v-if="!isLoading" />
    <div class="main-container" v-else>
        <div class="flex">
            <button class="back-button" @click="goBack"><i class='bx bx-arrow-back'></i> Back</button>
            <div class="header-title">
                <h1 class="title">{{ assistantData.name }}</h1>
                <p style="color: white;">{{ assistantData.detail }}</p>
            </div>
            <div class="content-box">
                <div class="tabs">
                    <div class="tab" :class="{ active: activeTab === 'suggest' }" @click="activeTab = 'suggest'">
                        <i class='bx bx-show-alt'></i> Gợi ý
                    </div>
                    <div v-if="historys.length > 0" class="tab" :class="{ active: activeTab === 'history' }"
                        @click="activeTab = 'history'">
                        <i class='bx bx-history' ></i> Lịch sử
                    </div>
                </div>
                <div class="content">
                    <div v-if="activeTab === 'suggest'" class="content-center">
                        <div class="actions">
                            <button v-for="(suggest, index) in suggests" :key="index" @click="executeAction(suggest)"
                                class="action-card">
                                <div class="icon">
                                    <img width="30" src="https://cdn-icons-png.flaticon.com/512/8561/8561386.png"
                                        alt="icon suggest">
                                    <!-- <i class='bx bx-message-square-edit'></i> -->
                                </div>
                                <p class="title">{{ suggest }}</p>
                            </button>
                        </div>
                        <div class="prompts">
                            <div class="prompt-controls">
                                <button @click="addPrompt" class="add-btn">Thêm đề xuất</button>
                            </div>
                            <div v-if="prompts.length > 0" class="prompt-box">
                                <div v-for="(prompt, index) in prompts" :key="prompt.id" class="prompt-card"
                                    @click="executePrompt(prompt)">
                                    <div class="prompt-icon">
                                        <img :src="icon_logo" alt="Prompt Icon" />
                                    </div>
                                    <div class="prompt-content">
                                        <div class="prompt-title">{{ prompt.name }}</div>
                                        <div class="prompt-description">{{ prompt.prompt_text }}</div>
                                        <div class="prompt-action">
                                            <button @click.stop="editPrompt(prompt)" class="delete-btn">
                                                <i class='bx bx-edit-alt'></i>
                                            </button>
                                            <button @click.stop="deletePrompt(prompt.id)" class="delete-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                    viewBox="0 0 24 24">
                                                    <path fill="var(--color-primary)"
                                                        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Pagination :total="totalPrompts" :itemsPerPage="itemsPromptPage"
                                :currentPage="currentPromptPage" @changePage="changePromptPage" />
                        </div>
                    </div>
                    <div v-if="activeTab === 'history'" class="content-center">
                        <div class="history" v-if="historys.length > 0">
                            <div class="history-item" v-for="item in historys" :key="item.id"
                                @click="openHistory(item.thread_idid)">
                                {{ item.name }}
                            </div>
                        </div>
                        <Pagination :total="totalHistory" :itemsPerPage="itemsHistoryPage"
                            :currentPage="currentHistoryPage" @changePage="changeHistoryPage" />
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
        <AddPromptPopup v-if="showPopup" :assistantId="assistantId" :isEdit="isEdit" :selectePrompt="selectePrompt"
            :visible="showPopup" @close="showPopup = false" @promptAdded="addPromptToList" />
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
    margin-bottom: 40px;
}

.header-title .title {
    font-size: 30px;
    font-weight: bold;
    color: var(--color-primary);
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
    background-color: #c9302c;
    opacity: 0.8;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.action-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 5px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: calc((100% - 20px)/2);
    max-width: 150px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
.action-card .icon img {
    width: 20px;
    height: 20px;
}
.action-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.action-card:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.action-card .icon {
    color: var(--color-primary);
    margin: 0 auto;
}

.action-card .title {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    width: fit-content;
}

.prompts {
    padding: 20px;
}

.prompt-controls {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.add-btn {
    background-color: var(--color-primary);
    color: #fff;
    padding: 5px 15px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 400;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-btn:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.prompt-box {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.prompt-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    width: calc(50% - 10px);
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.prompt-card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
}

.prompt-icon img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    transition: transform 0.3s ease;
}

.prompt-card:hover .prompt-icon img {
    transform: scale(1.1);
}

.prompt-content {
    flex: 1;
}

.prompt-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
    transition: color 0.3s ease;
}

.prompt-card:hover .prompt-title {
    color: var(--color-primary);
}

.prompt-description {
    font-size: 12px;
    color: #555;
    margin-bottom: 10px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
}

.prompt-action {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.edit-btn,
.delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
    transition: transform 0.2s ease, color 0.3s ease;
}

.edit-btn:hover {
    color: var(--color-primary);
    transform: scale(1.1);
}


.delete-btn i {
    font-size: 26px;
    color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .prompt-card {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
    }

    .prompt-icon img {
        margin: 0 0 10px 0;
    }
    .back-button {
        right: 6px;
        left: auto;
        top: 6px;
    }
}

.history {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.history-item {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 80%;
    margin: 0 auto;
    -webkit-line-clamp: 2;
    font-size: 14px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
}

.history-item:hover {
    background-color: #f1f1f1;
    color: #c9302c;
}

.prompts .pagination {
    text-align: center;
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
    max-width: 800px;
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