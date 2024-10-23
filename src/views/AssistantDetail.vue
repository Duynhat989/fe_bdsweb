<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('chat');

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
        <div class="main-title">
            <h1 class="title">Bất động sản Hưng Thịnh Hỏi đáp trợ lý</h1>
            <p>Kiến tạo giá trị vững bền – Nơi an cư lạc nghiệp cùng Bất động sản Hưng Thịnh.</p>
        </div>
        <div class="search-bar">
            <div class="search-container">
                <div class="input-wrapper">
                    <input type="text" placeholder="Tìm kiếm trợ lý hỗ trợ..." />
                    <span class="search-icon">🔍</span>
                </div>
                <button class="search-button">Tìm kiếm</button>
            </div>
            <div class="actions">
                <button v-for="action in actions" :key="action.id" @click="executeAction(action)">
                    {{ action.name }}
                </button>
            </div>
        </div>
        <div class="content-box">
            <div class="tabs">
                <div class="tab" :class="{ active: activeTab === 'chat' }" @click="activeTab = 'chat'">
                    Chat
                </div>
                <div v-if="history.length > 0" class="tab" :class="{ active: activeTab === 'history' }"
                    @click="activeTab = 'history'">
                    Lịch sử
                </div>
            </div>
            <div class="content">
                <p v-if="activeTab === 'chat'">Nội dung của Đoạn chat sẽ hiển thị ở đây.</p>
                <p v-else-if="activeTab === 'history'">
                    <span v-if="history.length > 0">Nội dung của Lịch sử sẽ hiển thị ở đây.</span>
                    <span v-else>Không có lịch sử để hiển thị.</span>
                </p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.main-title {
    text-align: center;
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
    padding: 10px 10px;
    border-radius: 5px;
    margin-left: 10px;
    font-size: 18px;
    cursor: pointer;
}

.search-button:hover {
    background-color: #c9302c;
}

.actions {
    width: 100%;
    margin-top: 20px;
    text-align: center;
}

.actions button {
    margin: 0 5px;
    padding: 10px;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    position: relative;
    text-align: center;
    top: 0;
    font-size: 16px;
    vertical-align: top;
    white-space: nowrap;
    transition: opacity 0.2s ease-in, top 0.2s ease-in;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.actions button:hover {
    background-color: #c9302c;
    color: #FFF;
    opacity: .8;
    top: -4px;
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
    text-align: left;
}

/* Responsive Styles */
@media (max-width: 1200px) {
    .main-container {
        max-width: 1000px;
        padding: 15px;
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
    .actions button {
        margin: 5px;
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
    .actions button {
        font-size: 14px;
    }
}
</style>