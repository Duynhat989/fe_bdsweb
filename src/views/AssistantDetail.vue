<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('suggest');

const actions = ref([
    { id: 1, name: 'Create image' },
    { id: 2, name: 'Analyze images' },
    { id: 3, name: 'Summarize text' },
    { id: 4, name: 'Brainstorm' },
    { id: 5, name: 'More' }
]);

const history = ref([
    { id: 1, description: 'History entry 1' },
    { id: 2, description: 'History entry 2' },
    { id: 3, description: 'History entry 3' }
]);

const executeAction = (action) => {

};

onMounted(() => {

});
</script>
<template>
    <div class="main-container">
        <div class="header-title">
            <h1 class="title">Hỏi đáp trợ lý</h1>
            <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
        </div>
        <div class="search-bar">
            <div class="search-container">
                <div class="input-wrapper">
                    <input type="text" placeholder="Nhập yêu cầu hỗ trợ..." />
                    <span class="search-icon">🔍</span>
                </div>
                <button class="search-button"><i class='bx bx-up-arrow-circle'></i></button>
            </div>
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
                <div v-if="activeTab === 'suggest'">
                    <div class="actions">
                        <button v-for="action in actions" :key="action.id" @click="executeAction(action)"
                            class="action-card">
                            <div class="icon">
                                <i class="bx bx-message-square-dots"></i>
                            </div>
                            <div class="title">{{ action.name }}</div>
                        </button>
                    </div>
                </div>

                <div v-if="activeTab === 'history'">
                    <div class="history" v-if="history.length > 0">
                        <div class="history-item" v-for="item in history" :key="item.id" @click="openHistory(item)">
                            <div class="description">{{ item.description }}</div>
                        </div>
                    </div>
                    <span v-else>Không có lịch sử để hiển thị.</span>
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

.main-container {
    max-width: 1400px;
    margin: 5px auto;
    position: relative;
}

.search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    flex-direction: column;
}

.search-container {
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

.search-icon {
    position: absolute;
    left: 10px;
    font-size: 20px;
}

.search-button {
    background-color: #d9534f;
    color: #fff;
    border: none;
    padding: 8px 10px 4px 10px;
    border-radius: 5px;
    margin-left: 10px;
    font-size: 25px;
    cursor: pointer;
}

.search-button:hover {
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
    max-width: 200px;
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
    padding: 20px;
    margin-top: 20px;
    position: relative;
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

/* Responsive Styles */
@media (max-width: 1200px) {
    .main-container {
        max-width: 1000px;
    }

    .search-container {
        width: 70%;
    }
}

@media (max-width: 992px) {
    .main-container {
        max-width: 800px;
    }

    .search-container {
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

    .search-container {
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

    .search-container {
        width: 100%;
    }

    .input-wrapper input {
        font-size: 14px;
    }

    .search-button {
        font-size: 14px;
    }

    .history-item {
        width: 100%;
    }
}
</style>