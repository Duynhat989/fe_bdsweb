<script setup>
import { ref } from 'vue';

const contractName = ref('');
const contractType = ref('');
const contractDate = ref('');
const partiesInvolved = ref('');
const contractDetails = ref('');

// call api
const handleSubmit = () => {

};
</script>
<template>
    <div class="create-contract">
        <div class="header-title">
            <h1 class="title">Tạo mới hợp đồng</h1>
            <p class="subtitle">Tạo hợp đồng mới theo nhu cầu của bạn với các mẫu có sẵn và tùy chỉnh dễ dàng.</p>
        </div>
        <form class="contract-form" @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="contractName">Tên hợp đồng:</label>
                <input type="text" id="contractName" v-model="contractName" placeholder="Nhập tên hợp đồng" required />
            </div>

            <div class="form-group">
                <label for="contractType">Loại hợp đồng:</label>
                <select id="contractType" v-model="contractType" required>
                    <option value="">Chọn loại hợp đồng</option>
                    <option value="mua_ban">Hợp đồng mua bán</option>
                    <option value="lao_dong">Hợp đồng lao động</option>
                    <option value="dich_vu">Hợp đồng dịch vụ</option>
                    <option value="thue_nha">Hợp đồng thuê nhà</option>
                </select>
            </div>

            <div class="form-group">
                <label for="contractDate">Ngày ký:</label>
                <input type="date" id="contractDate" v-model="contractDate" @focus="$event.target.showPicker()"
                    required />
            </div>
            <div class="form-group">
                <label for="partiesInvolved">Các bên tham gia:</label>
                <input type="text" id="partiesInvolved" v-model="partiesInvolved"
                    placeholder="Nhập tên các bên tham gia" required />
            </div>

            <div class="form-group">
                <label for="contractDetails">Chi tiết hợp đồng:</label>
                <textarea id="contractDetails" v-model="contractDetails"
                    placeholder="Nhập nội dung chi tiết của hợp đồng" rows="5" required></textarea>
            </div>

            <button type="submit" class="submit-button">Tạo hợp đồng</button>
        </form>
    </div>
</template>

<style scoped>
.create-contract {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
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


.contract-form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
    text-align: left;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.submit-button {
    background-color: #c03228;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #a02822;
}
</style>